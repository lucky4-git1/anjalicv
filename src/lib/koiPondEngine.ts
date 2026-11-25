// @ts-nocheck
export interface KoiPondOptions {
  section: HTMLElement;
  waterCanvas: HTMLCanvasElement;
  artCanvas: HTMLCanvasElement;
  floatingTabs: HTMLElement[];
}

export function initKoiPond({
  section,
  waterCanvas,
  artCanvas,
  floatingTabs: tabEls,
}: KoiPondOptions): () => void {
  const gl = waterCanvas.getContext('webgl2', { alpha: false, antialias: true, powerPreference: 'high-performance' });
  const art = artCanvas.getContext('2d');
  if (!art) return () => {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -10000, y: -10000, active: false };
  let width = 1, height = 1, dpr = 1, time = 0, lastFrame = 0, waveAccumulator = 0, day = false;
  let destroyed = false;
  let gridW = 156, gridH = 92, previous, current, next, fieldBytes, fieldTexture;
  let reflectionTexture=null;
  let uniforms = {};
  let fishProgram = null, fishBuffer = null, fishVertexCount = 0, fishUniforms = {};
  let goldfishProgram=null,goldfishModels=[],goldfishUniforms={},goldfishReady=false;
  const impulses = [];
  const visualRipples = [];
  const rippleUniformData = new Float32Array(20);

  const pads = [
    { x: .277, y: .035, r: 86, gap: 2.6, seed: 1 }, { x: .93, y: .14, r: 57, gap: 5.4, seed: 2 },
    { x: .49, y: .72, r: 70, gap: 1.5, seed: 3 }, { x: .73, y: .75, r: 103, gap: 5.8, seed: 4 },
    { x: .285, y: .97, r: 82, gap: 4.9, seed: 5 }, { x: .91, y: .97, r: 91, gap: 2.7, seed: 6 },
    { x: .04, y: -.04, r: 86, gap: 4.8, seed: 7 },
  ];
  const blossoms = [
    { x: .67, y: .73, r: 47, seed: 2 }, { x: .32, y: .93, r: 31, seed: 3 },
    { x: .9, y: .88, r: 34, seed: 4 }, { x: .73, y: 1.04, r: 37, seed: 5 },
    { x: .03, y: .19, r: 33, seed: 6 },
  ];
  const petals = Array.from({ length: 19 }, (_, i) => ({
    x: ((i * 0.61803398875 + .08) % 1), y: ((i * .371 + .07) % 1),
    size: 5 + (i % 4) * 1.7, drift: .015 + (i % 3) * .008,
    phase: i * 1.7, rot: i * 1.13,
  }));
  const fish = [
    { x: .12, y: .29, route: [[.10,.30],[.18,.22],[.32,.24],[.38,.35],[.31,.46],[.16,.43]], cycle: 25, color: '#e8a345', marks: ['#f7e7c9'], length: 132, speed: 30, phase: .02, fin: '#dfaa64' },
    { x: .59, y: .17, route: [[.57,.16],[.65,.10],[.78,.12],[.84,.22],[.79,.31],[.65,.28]], cycle: 22, color: '#f6eee4', marks: ['#d65843', '#343a37'], length: 116, speed: 25, phase: .16, fin: '#e8dcd2' },
    { x: .84, y: .47, route: [[.86,.45],[.79,.34],[.68,.36],[.63,.48],[.70,.60],[.84,.59]], cycle: 23, color: '#f4eae1', marks: ['#c9503f'], length: 120, speed: 26, phase: .31, fin: '#ddd9cd' },
    { x: .10, y: .82, route: [[.08,.82],[.17,.73],[.29,.77],[.34,.88],[.27,.97],[.12,.94]], cycle: 28, color: '#a3cce5', marks: ['#eef4ed'], length: 124, speed: 21, phase: .47, fin: '#9cc5d5' },
    { x: .48, y: .58, route: [[.48,.58],[.42,.51],[.34,.56],[.37,.68],[.48,.73],[.57,.64]], cycle: 21, color: '#ef91b4', marks: ['#ffd4dc'], length: 104, speed: 23, phase: .62, fin: '#df9cb6' },
    { x: .79, y: .82, route: [[.79,.82],[.69,.75],[.66,.63],[.75,.54],[.87,.60],[.93,.73]], cycle: 24, color: '#fff7ee', marks: ['#d45442', '#353937'], length: 94, speed: 22, phase: .78, fin: '#e8ddd2' },
  ].map((f, i) => ({ ...f, i, modelIndex:i%3, vx: 0, vy: 0, heading: 0, headingReady:false, lastX:f.x, lastY:f.y, speedNow:f.speed, flapPhase:f.phase*Math.PI*2, followX: 0, followY: 0, nextWake: 2+i*.8 }));
  const floatingTabs = tabEls.map((element, index) => ({
    element,
    index,
    fishIndex: [0, 2, 5][index] ?? 0,
    phase: index * 1.31,
  }));

  function makeReflectionMap() {
    const map=document.createElement('canvas');map.width=768;map.height=512;
    const c=map.getContext('2d');
    const base=c.createLinearGradient(0,0,0,512);base.addColorStop(0,'#63827a');base.addColorStop(.23,'#355b55');base.addColorStop(.6,'#143c3b');base.addColorStop(1,'#082c30');
    c.fillStyle=base;c.fillRect(0,0,768,512);
    const glow=(x,y,r,color)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(180,220,205,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);};
    glow(520,100,230,'rgba(180,220,208,.36)');glow(240,220,180,'rgba(86,145,130,.22)');glow(680,350,190,'rgba(83,150,135,.2)');
    c.save();c.filter='blur(11px)';c.lineCap='round';
    for(let i=0;i<11;i++){
      const x=(i*83+25)%820-25,y=(i*47)%175-55;
      c.strokeStyle=i%3?'rgba(8,38,34,.46)':'rgba(220,237,215,.18)';c.lineWidth=5+(i%4)*3;
      c.beginPath();c.moveTo(x-70,y+90);c.bezierCurveTo(x-20,y+50,x+35,y+24,x+95,y-42);c.stroke();
    }
    for(let i=0;i<52;i++){
      const x=(i*137+31)%768,y=(i*71+17)%250-35,r=14+(i*19)%32;
      c.fillStyle=i%4?'rgba(11,55,43,.54)':'rgba(174,208,170,.24)';
      c.beginPath();c.ellipse(x,y,r,r*.48,(i%7)*.31,0,Math.PI*2);c.fill();
    }
    c.restore();
    c.save();c.filter='blur(8px)';
    for(let i=0;i<14;i++){
      const x=(i*173+61)%768,y=270+(i*97)%245;
      c.strokeStyle=i%3?'rgba(183,223,212,.15)':'rgba(244,219,212,.2)';c.lineWidth=2+(i%3);
      c.beginPath();c.moveTo(x-95,y+15);c.bezierCurveTo(x-32,y-21,x+30,y+23,x+104,y-8);c.stroke();
    }
    c.restore();return map;
  }
  const reflectionMap=makeReflectionMap();

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  const vertexSource = `#version 300 es
    precision highp float;
    out vec2 vUv;
    void main(){
      vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));
      vUv=p*.5;
      gl_Position=vec4(p*2.0-1.0,0.0,1.0);
    }`;
  const fragmentSource = `#version 300 es
    precision highp float;
    in vec2 vUv;
    out vec4 outColor;
    uniform sampler2D uHeight;
    uniform sampler2D uEnvironment;
    uniform vec2 uGrid;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uDay;
    uniform vec4 uRipples[5];
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float wave(vec2 p){return texture(uHeight,clamp(p,vec2(0.002),vec2(0.998))).r*2.0-1.0;}
    void main(){
      vec2 uv=vUv; vec2 p=uv*vec2(uResolution.x/uResolution.y,1.0);
      float t=uTime;
      float h=wave(uv);
      vec2 texel=1.0/uGrid;
      float dx=wave(uv+vec2(texel.x,0.0))-wave(uv-vec2(texel.x,0.0));
      float dy=wave(uv+vec2(0.0,texel.y))-wave(uv-vec2(0.0,texel.y));
      vec2 flow=vec2(sin(p.y*5.4+t*.18),cos(p.x*4.8-t*.14));
      float ambientA=sin(p.x*5.2+p.y*2.1+t*.28);
      float ambientB=sin(p.x*2.0-p.y*4.3-t*.22);
      float ambientC=sin(p.x*8.1+p.y*1.7+t*.19);
      float ambientDx=cos(p.x*5.2+p.y*2.1+t*.28)*5.2*.022
        +cos(p.x*2.0-p.y*4.3-t*.22)*2.0*.015
        +cos(p.x*8.1+p.y*1.7+t*.19)*8.1*.006;
      float ambientDy=cos(p.x*5.2+p.y*2.1+t*.28)*2.1*.022
        -cos(p.x*2.0-p.y*4.3-t*.22)*4.3*.015
        +cos(p.x*8.1+p.y*1.7+t*.19)*1.7*.006;
      float rippled=h*1.75+ambientA*.022+ambientB*.015+ambientC*.006;
      vec2 interactiveNormal=vec2(0.0);float interactiveGlint=0.0;
      for(int i=0;i<5;i++){
        vec4 ripple=uRipples[i];
        if(ripple.w>0.0){
          vec2 delta=p-ripple.xy*vec2(uResolution.x/uResolution.y,1.0);
          float distanceToRipple=length(delta);
          float front=distanceToRipple-ripple.z*.32;
          float envelope=exp(-ripple.z*1.7-abs(front)*17.0)*ripple.w;
          float phase=front*72.0;
          vec2 radial=delta/max(distanceToRipple,.001);
          interactiveNormal+=radial*cos(phase)*envelope*.075;
          interactiveGlint+=pow(max(0.0,1.0-abs(sin(phase))),14.0)*envelope;
        }
      }
      vec3 normal=normalize(vec3(-dx*11.0+ambientDx+flow.x*.045+interactiveNormal.x,-dy*11.0+ambientDy+flow.y*.045+interactiveNormal.y,1.0));
      vec3 lightDir=normalize(vec3(-.42,.62,.78));
      float diffuse=max(dot(normal,lightDir),0.0);
      float fresnel=pow(1.0-max(normal.z,0.0),3.0);
      vec2 warped=p+normal.xy*.11+flow*.016;
      vec2 reflectionUv=clamp(vec2(warped.x,1.0-uv.y)+normal.xy*.075+flow*.008,vec2(.002),vec2(.998));
      vec3 reflected=texture(uEnvironment,reflectionUv).rgb;
      float n=noise(warped*2.4+vec2(t*.025,-t*.018));
      float n2=noise(warped*7.1-vec2(t*.055,t*.035));
      float causticA=sin(warped.x*10.0+sin(warped.y*8.0+t*.22)*2.1+t*.28);
      float causticB=sin(warped.y*12.0+sin(warped.x*6.5-t*.16)*1.8-t*.21);
      float caustics=pow(max(causticA*causticB,0.0),2.7)*(0.22+n*.78);
      float veinA=sin(warped.x*19.0+sin(warped.y*9.0+t*.3)*3.2+t*.22);
      float veinB=sin(warped.y*16.0+sin(warped.x*7.0-t*.24)*2.6-t*.17);
      float veins=pow(max(veinA*veinB-.24,0.0),2.0);
      float silverGlints=pow(max(sin(warped.x*31.0+sin(warped.y*14.0+t*.45)*2.2)*sin(warped.y*23.0+sin(warped.x*8.0-t*.32)*1.7),0.0),7.0);
      float shimmer=pow(max(0.0,1.0-abs(n2-.54)*8.0),5.0)*.08;
      vec3 deep=vec3(.018,.095,.098);
      vec3 teal=vec3(.042,.205,.195);
      vec3 lit=vec3(.36,.63,.56);
      if(uDay>.5){deep=vec3(.065,.235,.208);teal=vec3(.12,.34,.28);lit=vec3(.66,.81,.62);}
      vec3 color=mix(deep,teal,smoothstep(.12,.92,n*.72+n2*.32+diffuse*.18));
      color=mix(color,reflected,.14+fresnel*.3);
      color+=lit*(caustics*.76+veins*.42+shimmer+fresnel*.2);
      color+=vec3(.72,.94,.88)*(silverGlints*.16+pow(max(dot(reflect(-lightDir,normal),vec3(0,0,1)),0.0),16.0)*.48);
      color+=vec3(.68,.91,.85)*min(interactiveGlint*.14,.14);
      color+=vec3(.42,.78,.71)*clamp(abs(rippled)*.21,0.0,.22);
      float edge=1.0-smoothstep(.30,.83,length((uv-.5)*vec2(1.0,.82)));
      color*=.79+edge*.26;
      float grain=(hash(gl_FragCoord.xy+fract(t)*100.0)-.5)*.012;
      color+=grain;
      outColor=vec4(color,1.0);
    }`;

  const fishVertexSource=`#version 300 es
    precision highp float;
    layout(location=0) in vec3 aPosition;
    layout(location=1) in vec3 aNormal;
    layout(location=2) in vec3 aLocal;
    layout(location=3) in float aPart;
    layout(location=4) in float aFlex;
    uniform vec2 uCenter;
    uniform vec2 uScale;
    uniform float uAngle;
    uniform float uFlap;
    uniform float uDepth;
    out vec3 vNormal;
    out vec3 vLocal;
    flat out int vPart;
    void main(){
      vec3 p=aPosition;
      float tailWeight=1.0-smoothstep(-1.02,-.16,p.x);
      p.y+=sin(uFlap*2.8+p.x*4.4)*.15*tailWeight;
      p.y+=aFlex*uFlap*.075;
      p.z+=aFlex*abs(uFlap)*.025;
      vec2 local=vec2(p.x,p.y*.66+p.z*.95)*uScale;
      float c=cos(uAngle),s=sin(uAngle);
      vec2 rotated=vec2(local.x*c-local.y*s,local.x*s+local.y*c);
      vec3 angledNormal=normalize(vec3(aNormal.x,aNormal.y*.66+aNormal.z*.95,aNormal.z*.66-aNormal.y*.95));
      vec2 nxy=vec2(angledNormal.x*c-angledNormal.y*s,angledNormal.x*s+angledNormal.y*c);
      vNormal=normalize(vec3(nxy,angledNormal.z));
      vLocal=p;
      vPart=int(aPart);
      gl_Position=vec4(uCenter+rotated,uDepth-(p.z*.66-p.y*.95)*.11-aPart*.002,1.0);
    }`;

  const fishFragmentSource=`#version 300 es
    precision highp float;
    in vec3 vNormal;
    in vec3 vLocal;
    flat in int vPart;
    uniform vec3 uBase;
    uniform vec3 uMark;
    uniform vec3 uSecondary;
    uniform vec3 uFin;
    uniform float uPattern;
    uniform float uPhase;
    uniform float uShadow;
    out vec4 outColor;
    float hash(float x){return fract(sin(x*127.1+uPhase*13.7)*43758.5453);}
    void main(){
      float x=vLocal.x,y=vLocal.y;
      float warp=sin(y*14.0+uPhase*5.0)*.035+sin(y*31.0-x*9.0)*.015;
      vec2 markings=vec2(x+warp,y+sin(x*11.0-uPhase)*.026);
      float spotA=1.0-smoothstep(.78,1.12,length((markings-vec2(-.37,.025))*vec2(5.0,2.8)));
      float spotB=1.0-smoothstep(.76,1.13,length((markings-vec2(.08+sin(uPhase)*.045,-.025))*vec2(4.6,2.9)));
      float spotC=1.0-smoothstep(.77,1.12,length((markings-vec2(.49,.04))*vec2(5.4,3.15)));
      float across=1.0-smoothstep(.1,.29,abs(y+sin(x*8.0+uPhase)*.025));
      float patches=max(max(spotA,spotB*.88),spotC*.76);
      if(uPattern>2.5&&uPattern<3.5) patches*=.68;
      if(uPattern>3.5&&uPattern<4.5) patches=max(spotB,spotC*.45)*across;
      vec3 color=mix(uBase,uMark,smoothstep(.12,.68,patches));
      float sumi=0.0;
      if(uPattern>0.5&&uPattern<1.5||uPattern>4.5){
        float inkA=1.0-smoothstep(.035,.09,length(vec2(x-.34+warp,y+.055)));
        float inkB=1.0-smoothstep(.028,.075,length(vec2(x+.07-warp,y-.07)));
        sumi=max(inkA,inkB)*across;
      }
      color=mix(color,uSecondary,sumi*.92);
      float scaleWave=sin(x*104.0+cos(y*46.0+x*17.0)*1.5)*sin(y*148.0+x*24.0);
      float scaleRidge=smoothstep(.83,.99,scaleWave);
      float scaleShade=smoothstep(-.9,-.15,scaleWave);
      color*=1.0-scaleRidge*.11+scaleShade*.025;
      vec3 N=normalize(vNormal);
      if(vPart==0){
        vec2 scaleGrid=vec2((x+1.4)*12.0,(y+.4)*18.0);
        float scaleRow=floor(scaleGrid.y);
        scaleGrid.x+=mod(scaleRow,2.0)*.5;
        vec2 scaleCell=fract(scaleGrid)-.5;
        float scaleArc=length(vec2(scaleCell.x*1.3,scaleCell.y*1.05));
        float scaleGroove=1.0-smoothstep(.36,.48,scaleArc);
        float scaleTone=hash(floor(scaleGrid.x)+scaleRow*71.0);
        color*=1.0-scaleGroove*(.09+scaleTone*.065);
        color+=vec3(.83,.88,.81)*scaleGroove*(.03+scaleTone*.04)*max(N.z,0.0);
        color+=vec3(1.0,.97,.88)*pow(max(N.z,0.0),5.0)*.1;
      }
      vec3 L=normalize(vec3(-.36,.48,.8));
      float diffuse=max(dot(N,L),0.0);
      float view=max(N.z,0.0);
      float spec=pow(max(dot(reflect(-L,N),vec3(0,0,1)),0.0),22.0);
      float bodyWidth=.335*pow(max(0.0,min(1.0,(x+.78)/.32)),.55)*pow(max(0.0,min(1.0,(.91-x)/.38)),.58);
      float crossSection=abs(y)/max(bodyWidth,.001);
      float edgeShade=smoothstep(.45,.98,crossSection);
      color*=.22+diffuse*.96-edgeShade*.24;
      color+=vec3(.94,.97,.9)*(spec*.74+pow(max(dot(reflect(-L,N),vec3(0,0,1)),0.0),8.0)*.13);
      float dorsalSheen=exp(-pow(crossSection/.36,2.0));
      color+=vec3(1.0,.97,.9)*dorsalSheen*.12;
      float alpha=1.0;
      if(uShadow>.5){color=vec3(.003,.026,.027);alpha=.2;}
      else if(vPart==1){
        color=mix(uFin,color,.34);color*=.8+diffuse*.25;alpha=.58;
        if(x<-.72){float ray=sin(atan(y,x+1.04)*17.0);color*=.88+smoothstep(.72,.96,ray)*.12;}
      }
      if(uShadow<.5&&vPart==2){color=vec3(.025,.035,.03);color+=vec3(.7,.72,.65)*spec*.2;}
      if(uShadow<.5&&vPart==3){color=vec3(.98,.97,.88);}
      if(uShadow<.5&&vPart==4){color=mix(color,vec3(.26,.23,.19),.68);}
      outColor=vec4(color,alpha);
    }`;

  const goldfishVertexSource=`#version 300 es
    precision highp float;
    layout(location=0) in vec3 aPosition;
    layout(location=1) in vec3 aNormal;
    layout(location=2) in vec2 aUv;
    uniform vec2 uCenter;
    uniform vec2 uScale;
    uniform float uAngle;
    uniform float uFlap;
    uniform float uTailAmp;
    uniform float uDepth;
    uniform float uFacing;
    uniform float uShadow;
    uniform float uLongAxis;
    uniform vec3 uModelCenter;
    out vec2 vUv;
    out vec3 vNormal;
    out vec3 vSurfacePosition;
    void main(){
      vec3 p=aPosition-uModelCenter;
      float longitudinal=(uLongAxis>.5?p.x:p.z)*uFacing;
      float lateral=uLongAxis>.5?p.z:p.x;
      float tail=1.0-smoothstep(-.5,-.12,longitudinal);
      float sway=sin(uFlap+longitudinal*7.0)*.09*tail*uTailAmp;
      if(uLongAxis>.5)p.z+=sway;else p.x+=sway;
      p.y+=cos(uFlap*.8+longitudinal*6.0)*.022*tail*uTailAmp;
      longitudinal=(uLongAxis>.5?p.x:p.z)*uFacing;
      lateral=uLongAxis>.5?p.z:p.x;
      vec2 local=vec2(longitudinal,lateral*.86+p.y*.5)*uScale;
      float c=cos(uAngle),s=sin(uAngle);
      vec2 rotated=vec2(local.x*c-local.y*s,local.x*s+local.y*c);
      float longitudinalNormal=(uLongAxis>.5?aNormal.x:aNormal.z)*uFacing;
      float lateralNormal=uLongAxis>.5?aNormal.z:aNormal.x;
      vec3 n=normalize(vec3(longitudinalNormal,lateralNormal*.86+aNormal.y*.5,aNormal.y*.86-lateralNormal*.5));
      vec2 n2=vec2(n.x*c-n.y*s,n.x*s+n.y*c);
      vNormal=normalize(vec3(n2,n.z));
      float modelDepth=p.y*.86-lateral*.5;
      float depth=uDepth-modelDepth*.045;
      vSurfacePosition=vec3(rotated,depth);
      vUv=aUv;
      gl_Position=vec4(uCenter+rotated,depth,1.0);
    }`;

  const goldfishFragmentSource=`#version 300 es
    precision highp float;
    in vec2 vUv;
    in vec3 vNormal;
    in vec3 vSurfacePosition;
    uniform sampler2D uBaseColor;
    uniform sampler2D uMetalRough;
    uniform sampler2D uNormalMap;
    uniform vec4 uBaseFactor;
    uniform float uShadow;
    out vec4 outColor;
    void main(){
      if(uShadow>.5){outColor=vec4(.008,.035,.035,.18);return;}
      vec3 N=normalize(vNormal);
      vec3 mapN=texture(uNormalMap,vUv).xyz*2.0-1.0;
      vec3 dp1=dFdx(vSurfacePosition),dp2=dFdy(vSurfacePosition);
      vec2 duv1=dFdx(vUv),duv2=dFdy(vUv);
      vec3 tangent=normalize(dp1*duv2.y-dp2*duv1.y);
      vec3 bitangent=normalize(-dp1*duv2.x+dp2*duv1.x);
      N=normalize(mat3(tangent,bitangent,N)*mapN);
      vec4 base=texture(uBaseColor,vUv)*uBaseFactor;
      vec3 mr=texture(uMetalRough,vUv).rgb;
      float roughness=clamp(mr.g,.12,1.0),metallic=mr.b;
      vec3 L=normalize(vec3(-.42,.58,.92));
      vec3 V=normalize(vec3(.05,.08,1.0));
      float diffuse=max(dot(N,L),0.0);
      float gloss=pow(max(dot(reflect(-L,N),V),0.0),mix(76.0,7.0,roughness));
      float fresnel=pow(1.0-max(dot(N,V),0.0),4.0);
      vec3 color=base.rgb*(.32+diffuse*.83);
      color+=mix(vec3(.98,.95,.84),base.rgb,.35*metallic)*gloss*(.18+.72*(1.0-roughness));
      color+=vec3(.48,.78,.71)*fresnel*.15;
      outColor=vec4(color,base.a);
    }`;

  function buildFishMesh(){
    const data=[];
    const add=(p,n,part=0,flex=0)=>data.push(p[0],p[1],p[2],n[0],n[1],n[2],p[0],p[1],p[2],part,flex);
    const tri=(a,b,c,part=0,flexA=0,flexB=0,flexC=0)=>{add(a,[0,0,1],part,flexA);add(b,[0,0,1],part,flexB);add(c,[0,0,1],part,flexC);};
    const rings=50,slices=24,bodyStart=-.78,bodyEnd=.91;
    const profile=(x)=>{
      const left=Math.max(0,Math.min(1,(x-bodyStart)/.32));
      const right=Math.max(0,Math.min(1,(bodyEnd-x)/.38));
      const shoulder=Math.exp(-Math.pow((x-.03)/.61,2));
        return .335*Math.pow(left,.55)*Math.pow(right,.58)*(.68+.32*shoulder);
    };
    const ringVertices=[];
    for(let i=0;i<=rings;i++){
      const u=i/rings,x=bodyStart+(bodyEnd-bodyStart)*u,r=profile(x),rx=Math.max(.012,r*.72),step=.001;
      const slope=(profile(Math.min(bodyEnd,x+step))-profile(Math.max(bodyStart,x-step)))/(2*step);
      const row=[];
      for(let j=0;j<=slices;j++){
        const a=j/slices*Math.PI*2,co=Math.cos(a),si=Math.sin(a);
        const pos=[x,r*co,rx*si];
        const normal=[-slope*co,co/r,si/rx];const mag=Math.hypot(...normal)||1;
        row.push({pos,n:normal.map(v=>v/mag)});
      }
      ringVertices.push(row);
    }
    for(let i=0;i<rings;i++)for(let j=0;j<slices;j++){
      const a=ringVertices[i][j],b=ringVertices[i+1][j],c=ringVertices[i+1][j+1],d=ringVertices[i][j+1];
      add(a.pos,a.n);add(b.pos,b.n);add(c.pos,c.n);add(a.pos,a.n);add(c.pos,c.n);add(d.pos,d.n);
    }
    const polygon=(points,part=1,flexAt=()=>0)=>{
      const center=points.reduce((v,p)=>[v[0]+p[0]/points.length,v[1]+p[1]/points.length], [0,0]);
      for(let i=0;i<points.length;i++){
        const a=points[i],b=points[(i+1)%points.length];
        tri([center[0],center[1],.012],[a[0],a[1],.012],[b[0],b[1],.012],part,flexAt(center),flexAt(a),flexAt(b));
      }
    };
    const tail=[[-.74,.055]];
    const curve=(a,b,c,steps=5)=>{for(let i=1;i<=steps;i++){const t=i/steps,u=1-t;tail.push([u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1]]);}};
    curve([-.74,.055],[-.94,.15],[-1.17,.245]);curve([-1.17,.245],[-1.24,.27],[-1.25,.19]);curve([-1.25,.19],[-1.22,.11],[-1.12,.045]);
    tail.push([-1.34,0]);curve([-1.12,-.045],[-1.22,-.11],[-1.25,-.19]);curve([-1.25,-.19],[-1.24,-.27],[-1.17,-.245]);curve([-1.17,-.245],[-.94,-.15],[-.74,-.055]);
    polygon(tail,1,p=>Math.max(0,(-p[0]-.82)/.52));
    polygon([[-.15,.19],[-.08,.31],[.02,.37],[.17,.28],[.25,.2]],1);
    polygon([[-.02,-.2],[.08,-.34],[.24,-.4],[.32,-.22],[.19,-.16]],1);
    polygon([[-.54,.06],[-.71,.17],[-.82,.22],[-.76,.1],[-.58,.02]],1);
    const disc=(cx,cy,rx,ry,part,z)=>{
      const seg=16;
      for(let i=0;i<seg;i++){
        const a=i/seg*Math.PI*2,b=(i+1)/seg*Math.PI*2;
        tri([cx,cy,z],[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,z],[cx+Math.cos(b)*rx,cy+Math.sin(b)*ry,z],part);
      }
    };
    for(const side of [-1,1]){
      disc(.69,side*.105,.035,.035,2,.12);disc(.70,side*.105,.013,.014,3,.14);
      polygon([[.48,side*.035,.035],[.55,side*.11,.035],[.58,side*.035,.035]],4);
    }
    fishVertexCount=data.length/11;
    return new Float32Array(data);
  }

  async function loadFishModel(path,facing=1){
    if(!gl)return;
    const response=await fetch(path);
    if(!response.ok)throw new Error(`GLB request failed: ${response.status}`);
    const file=await response.arrayBuffer(),view=new DataView(file);
    if(view.getUint32(0,true)!==0x46546c67)throw new Error('Invalid GLB header');
    const jsonLength=view.getUint32(12,true),document=JSON.parse(new TextDecoder().decode(new Uint8Array(file,20,jsonLength)));
    const binaryHeader=20+jsonLength,binaryLength=view.getUint32(binaryHeader,true),binaryStart=binaryHeader+8;
    const binary=new Uint8Array(file,binaryStart,binaryLength);
    const readAccessor=(index)=>{
      const accessor=document.accessors[index],bufferView=document.bufferViews[accessor.bufferView];
      const componentCount={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[accessor.type];
      const componentBytes={5121:1,5123:2,5125:4,5126:4}[accessor.componentType];
      const stride=bufferView.byteStride||componentCount*componentBytes;
      const offset=bufferView.byteOffset+(accessor.byteOffset||0);
      if(accessor.componentType===5126&&stride===componentCount*4)return new Float32Array(file,binaryStart+offset,accessor.count*componentCount);
      if(accessor.componentType===5125&&stride===4)return new Uint32Array(file,binaryStart+offset,accessor.count);
      const output=accessor.componentType===5126?new Float32Array(accessor.count*componentCount):new Uint32Array(accessor.count*componentCount);
      const data=new DataView(file,binaryStart+offset,bufferView.byteLength-(accessor.byteOffset||0));
      for(let i=0;i<accessor.count;i++)for(let j=0;j<componentCount;j++){
        const at=i*stride+j*componentBytes,k=i*componentCount+j;
        if(accessor.componentType===5126)output[k]=data.getFloat32(at,true);
        else if(accessor.componentType===5125)output[k]=data.getUint32(at,true);
        else if(accessor.componentType===5123)output[k]=data.getUint16(at,true);
        else output[k]=data.getUint8(at);
      }
      return output;
    };
    const primitive=document.meshes[document.nodes.find(n=>n.mesh!==undefined)?.mesh??0].primitives[0];
    const positionAccessor=document.accessors[primitive.attributes.POSITION];
    const bounds=positionAccessor,modelCenter=bounds.min.map((v,i)=>(v+bounds.max[i])*.5);
    const longAxis=(bounds.max[0]-bounds.min[0])>=(bounds.max[2]-bounds.min[2])?1:0;
    const positions=readAccessor(primitive.attributes.POSITION),normals=readAccessor(primitive.attributes.NORMAL),uvs=readAccessor(primitive.attributes.TEXCOORD_0),indices=readAccessor(primitive.indices);
    const vao=gl.createVertexArray();gl.bindVertexArray(vao);
    for(const [location,data,size] of [[0,positions,3],[1,normals,3],[2,uvs,2]]){
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,0,0);
    }
    const indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    const uploadTexture=async(textureIndex,unit)=>{
      const image=document.images[document.textures[textureIndex].source],sourceView=document.bufferViews[image.bufferView];
      const bytes=binary.slice(sourceView.byteOffset,sourceView.byteOffset+sourceView.byteLength);
      const bitmap=await createImageBitmap(new Blob([bytes],{type:image.mimeType}));
      const texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,bitmap);gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);bitmap.close();return texture;
    };
    const material=document.materials[primitive.material||0],pbr=material.pbrMetallicRoughness||{};
    const baseTexture=await uploadTexture(pbr.baseColorTexture.index,0);
    const mrTexture=await uploadTexture(pbr.metallicRoughnessTexture.index,1);
    const normalTexture=await uploadTexture(material.normalTexture.index,2);
    return {vao,indexCount:indices.length,baseTexture,mrTexture,normalTexture,modelCenter,longAxis,facing,baseFactor:pbr.baseColorFactor||[1,1,1,1],metallicFactor:pbr.metallicFactor??1,roughnessFactor:pbr.roughnessFactor??1};
  }

  let program = null;
  let waterVao = null;
  if (gl) {
    gl.clearColor(0.07, 0.23, 0.22, 1.0);
    waterVao = gl.createVertexArray();
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    uniforms = {
      height: gl.getUniformLocation(program, 'uHeight'), environment: gl.getUniformLocation(program, 'uEnvironment'), grid: gl.getUniformLocation(program, 'uGrid'),
      resolution: gl.getUniformLocation(program, 'uResolution'), time: gl.getUniformLocation(program, 'uTime'),
      day: gl.getUniformLocation(program, 'uDay'),
      ripples: gl.getUniformLocation(program, 'uRipples[0]'),
    };
    fieldTexture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fieldTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uniforms.height, 0);
    reflectionTexture=gl.createTexture();gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,reflectionTexture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,reflectionMap);
    gl.uniform1i(uniforms.environment,1);gl.activeTexture(gl.TEXTURE0);

    fishProgram=gl.createProgram();
    gl.attachShader(fishProgram,compile(gl.VERTEX_SHADER,fishVertexSource));
    gl.attachShader(fishProgram,compile(gl.FRAGMENT_SHADER,fishFragmentSource));
    gl.linkProgram(fishProgram);
    if(!gl.getProgramParameter(fishProgram,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(fishProgram));
    fishUniforms={center:gl.getUniformLocation(fishProgram,'uCenter'),scale:gl.getUniformLocation(fishProgram,'uScale'),angle:gl.getUniformLocation(fishProgram,'uAngle'),flap:gl.getUniformLocation(fishProgram,'uFlap'),depth:gl.getUniformLocation(fishProgram,'uDepth'),base:gl.getUniformLocation(fishProgram,'uBase'),mark:gl.getUniformLocation(fishProgram,'uMark'),secondary:gl.getUniformLocation(fishProgram,'uSecondary'),fin:gl.getUniformLocation(fishProgram,'uFin'),pattern:gl.getUniformLocation(fishProgram,'uPattern'),phase:gl.getUniformLocation(fishProgram,'uPhase'),shadow:gl.getUniformLocation(fishProgram,'uShadow')};
    fishBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,fishBuffer);gl.bufferData(gl.ARRAY_BUFFER,buildFishMesh(),gl.STATIC_DRAW);
    gl.useProgram(fishProgram);
    for(let i=0;i<5;i++)gl.enableVertexAttribArray(i);
    gl.vertexAttribPointer(0,3,gl.FLOAT,false,44,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,44,12);gl.vertexAttribPointer(2,3,gl.FLOAT,false,44,24);gl.vertexAttribPointer(3,1,gl.FLOAT,false,44,36);gl.vertexAttribPointer(4,1,gl.FLOAT,false,44,40);
    gl.useProgram(program);
    goldfishProgram=gl.createProgram();
    gl.attachShader(goldfishProgram,compile(gl.VERTEX_SHADER,goldfishVertexSource));gl.attachShader(goldfishProgram,compile(gl.FRAGMENT_SHADER,goldfishFragmentSource));gl.linkProgram(goldfishProgram);
    if(!gl.getProgramParameter(goldfishProgram,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(goldfishProgram));
    goldfishUniforms={center:gl.getUniformLocation(goldfishProgram,'uCenter'),scale:gl.getUniformLocation(goldfishProgram,'uScale'),angle:gl.getUniformLocation(goldfishProgram,'uAngle'),flap:gl.getUniformLocation(goldfishProgram,'uFlap'),tailAmp:gl.getUniformLocation(goldfishProgram,'uTailAmp'),depth:gl.getUniformLocation(goldfishProgram,'uDepth'),facing:gl.getUniformLocation(goldfishProgram,'uFacing'),shadow:gl.getUniformLocation(goldfishProgram,'uShadow'),longAxis:gl.getUniformLocation(goldfishProgram,'uLongAxis'),modelCenter:gl.getUniformLocation(goldfishProgram,'uModelCenter'),baseFactor:gl.getUniformLocation(goldfishProgram,'uBaseFactor'),baseColor:gl.getUniformLocation(goldfishProgram,'uBaseColor'),metalRough:gl.getUniformLocation(goldfishProgram,'uMetalRough'),normalMap:gl.getUniformLocation(goldfishProgram,'uNormalMap')};
    gl.useProgram(goldfishProgram);gl.uniform1i(goldfishUniforms.baseColor,0);gl.uniform1i(goldfishUniforms.metalRough,1);gl.uniform1i(goldfishUniforms.normalMap,2);gl.useProgram(program);
    Promise.all([loadFishModel('/assets/models/goldfish.glb',1),loadFishModel('/assets/models/butterflyfish.glb',-1),loadFishModel('/assets/models/sanke-koi.glb',1)]).then(models=>{if(!destroyed){goldfishModels=models;goldfishReady=true;}}).catch(error=>console.error('Fish models could not load; using procedural fish instead.',error));
  }

  function resize() {
    const rect = section.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    width = rect.width; height = rect.height; dpr = Math.min(devicePixelRatio || 1, 1.75);
    for (const canvas of [waterCanvas, artCanvas]) {
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    }
    art.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (gl) gl.viewport(0, 0, waterCanvas.width, waterCanvas.height);
    gridW = Math.max(120, Math.min(192, Math.round(width / 8)));
    gridH = Math.max(82, Math.min(132, Math.round(height / 7)));
    previous = new Float32Array(gridW * gridH); current = new Float32Array(gridW * gridH); next = new Float32Array(gridW * gridH);
    fieldBytes = new Uint8Array(gridW * gridH); fieldBytes.fill(128);
    if (gl) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fieldTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gridW, gridH, 0, gl.RED, gl.UNSIGNED_BYTE, fieldBytes);
      gl.useProgram(program);
      gl.uniform2f(uniforms.grid, gridW, gridH);
    }
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(section);
  resize();

  function addImpulse(x, y, power = .42) {
    const gx = x / width * (gridW - 1), gy = (1 - y / height) * (gridH - 1);
    impulses.push({ x: gx, y: gy, radius: Math.max(2.2, gridW / width * 11), power, age: 0 });
    if (impulses.length > 15) impulses.shift();
  }
  function addVisualRipple(x,y,strength=1){
    visualRipples.push({x:x/width,y:1-y/height,time,strength});
    if(visualRipples.length>5)visualRipples.shift();
  }
  function applyImpulse(impulse) {
    const radius = impulse.radius * (1 + impulse.age * .12);
    const x0 = Math.max(1, Math.floor(impulse.x - radius * 2.6)), x1 = Math.min(gridW - 2, Math.ceil(impulse.x + radius * 2.6));
    const y0 = Math.max(1, Math.floor(impulse.y - radius * 2.6)), y1 = Math.min(gridH - 2, Math.ceil(impulse.y + radius * 2.6));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const dx = x - impulse.x, dy = y - impulse.y, d = Math.hypot(dx, dy) / radius;
      if (d < 2.6) current[y * gridW + x] += Math.cos(d * Math.PI * .5) * impulse.power * .085;
    }
  }
  function stepWater() {
    for (const impulse of impulses) applyImpulse(impulse);
    impulses.length=0;
    for (let y = 1; y < gridH - 1; y++) {
      const row = y * gridW;
      for (let x = 1; x < gridW - 1; x++) {
        const i = row + x, c = current[i];
        const lap = current[i-1] + current[i+1] + current[i-gridW] + current[i+gridW] - 4*c;
        next[i] = (2*c - previous[i] + lap*.22) * .992;
      }
    }
    for (let x = 0; x < gridW; x++) { next[x] = current[x] * .86; next[(gridH-1)*gridW+x] = current[(gridH-1)*gridW+x] * .86; }
    for (let y = 0; y < gridH; y++) { next[y*gridW] = current[y*gridW] * .86; next[y*gridW+gridW-1] = current[y*gridW+gridW-1] * .86; }
    const swap = previous; previous = current; current = next; next = swap;
  }
  function uploadWater() {
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    for (let i=0; i<current.length; i++) fieldBytes[i] = Math.max(0, Math.min(255, Math.round(128 + current[i]*115)));
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fieldTexture);
    gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,gridW,gridH,gl.RED,gl.UNSIGNED_BYTE,fieldBytes);
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,reflectionTexture);gl.activeTexture(gl.TEXTURE0);
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution,width,height);
    gl.uniform1f(uniforms.time,time);
    gl.uniform1f(uniforms.day,day?1:0);
    rippleUniformData.fill(0);
    for(let i=0;i<visualRipples.length;i++){
      const ripple=visualRipples[i],offset=i*4,age=time-ripple.time;
      if(age<1.25){rippleUniformData[offset]=ripple.x;rippleUniformData[offset+1]=ripple.y;rippleUniformData[offset+2]=age;rippleUniformData[offset+3]=ripple.strength;}
    }
    gl.uniform4fv(uniforms.ripples,rippleUniformData);
    gl.bindVertexArray(waterVao);
    gl.drawArrays(gl.TRIANGLES,0,3);
    gl.bindVertexArray(null);
    if(goldfishReady)drawGoldfishMeshes();else drawFishMeshes();
  }

  function drawGoldfishMeshes(){
    gl.useProgram(goldfishProgram);
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    for(const f of fish){
      const mesh=goldfishModels[f.modelIndex];gl.bindVertexArray(mesh.vao);
      for(const [unit,texture] of [[0,mesh.baseTexture],[1,mesh.mrTexture],[2,mesh.normalTexture]]){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,texture);}
      gl.uniform4fv(goldfishUniforms.baseFactor,mesh.baseFactor);gl.uniform3fv(goldfishUniforms.modelCenter,mesh.modelCenter);gl.uniform1f(goldfishUniforms.longAxis,mesh.longAxis);
      const scale=Math.max(.38,Math.min(1.08,width/1272)),length=f.length*scale*1.38;
      const centerX=f.x*2-1,centerY=1-f.y*2,scaleX=2*length/width,scaleY=2*length*.74/height;
      const angle=-Math.atan2(f.vy,f.vx),tailAmp=Math.max(.6,Math.min(1.55,f.speedNow/24));
      gl.uniform2f(goldfishUniforms.scale,scaleX,scaleY);gl.uniform1f(goldfishUniforms.angle,angle);gl.uniform1f(goldfishUniforms.flap,f.flapPhase);gl.uniform1f(goldfishUniforms.tailAmp,tailAmp);gl.uniform1f(goldfishUniforms.facing,mesh.facing);
      gl.uniform1f(goldfishUniforms.shadow,1.0);gl.uniform2f(goldfishUniforms.center,centerX+scaleX*.065,centerY-scaleY*.12);gl.uniform1f(goldfishUniforms.depth,-.052);gl.drawElements(gl.TRIANGLES,mesh.indexCount,gl.UNSIGNED_INT,0);
      gl.uniform1f(goldfishUniforms.shadow,0.0);gl.uniform2f(goldfishUniforms.center,centerX,centerY);gl.uniform1f(goldfishUniforms.depth,-.08);gl.drawElements(gl.TRIANGLES,mesh.indexCount,gl.UNSIGNED_INT,0);
    }
    gl.bindVertexArray(null);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.activeTexture(gl.TEXTURE0);gl.useProgram(program);
  }

  function hexColor(hex){const n=parseInt(hex.slice(1),16);return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255];}
  function drawFishMeshes(){
    gl.useProgram(fishProgram);gl.bindBuffer(gl.ARRAY_BUFFER,fishBuffer);
    for(let i=0;i<5;i++)gl.enableVertexAttribArray(i);
    gl.vertexAttribPointer(0,3,gl.FLOAT,false,44,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,44,12);gl.vertexAttribPointer(2,3,gl.FLOAT,false,44,24);gl.vertexAttribPointer(3,1,gl.FLOAT,false,44,36);gl.vertexAttribPointer(4,1,gl.FLOAT,false,44,40);
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    for(const f of fish){
      const scale=Math.max(.38,Math.min(1.08,width/1272)), length=f.length*scale*1.22;
      const centerX=f.x*2-1,centerY=1-f.y*2,scaleX=2*length/2.3/width,scaleY=2*length/2.3/height;
      gl.uniform2f(fishUniforms.scale,scaleX,scaleY);
      gl.uniform1f(fishUniforms.angle,-Math.atan2(f.vy,f.vx));
      gl.uniform1f(fishUniforms.flap,Math.sin(time*4.3+f.phase)*.62);
      gl.uniform3fv(fishUniforms.base,hexColor(f.color));gl.uniform3fv(fishUniforms.mark,hexColor(f.marks[0]));gl.uniform3fv(fishUniforms.secondary,hexColor(f.marks[1]||'#343a37'));gl.uniform3fv(fishUniforms.fin,hexColor(f.fin));
      gl.uniform1f(fishUniforms.pattern,f.i);gl.uniform1f(fishUniforms.phase,f.phase+time*.08);
      gl.uniform1f(fishUniforms.shadow,1);gl.uniform2f(fishUniforms.center,centerX+scaleX*.12,centerY-scaleY*.18);gl.uniform1f(fishUniforms.depth,-.048);gl.drawArrays(gl.TRIANGLES,0,fishVertexCount);
      gl.uniform1f(fishUniforms.shadow,0);gl.uniform2f(fishUniforms.center,centerX,centerY);gl.uniform1f(fishUniforms.depth,-.06);
      gl.drawArrays(gl.TRIANGLES,0,fishVertexCount);
    }
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(program);
  }

  function drawPad(pad) {
    const sceneScale=Math.max(.38,Math.min(1.08,width/1272));
    const x=pad.x*width,y=pad.y*height,r=pad.r*sceneScale*1.08;
    art.save(); art.translate(x,y); art.rotate(Math.sin(time*.12+pad.seed)*.025);
    art.shadowColor='rgba(0,18,18,.35)'; art.shadowBlur=r*.2; art.shadowOffsetY=r*.11;
    const gradient=art.createRadialGradient(-r*.28,-r*.34,r*.08,0,0,r);
    gradient.addColorStop(0,'#427956'); gradient.addColorStop(.58,'#316849'); gradient.addColorStop(1,'#204f3e');
    art.fillStyle=gradient; art.beginPath();
    art.moveTo(Math.cos(pad.gap)*r,Math.sin(pad.gap)*r);
    art.arc(0,0,r,pad.gap+.12,pad.gap+Math.PI*2-.12,false); art.closePath(); art.fill();
    art.shadowColor='transparent'; art.strokeStyle='rgba(182,222,172,.18)'; art.lineWidth=1;
    for(let i=0;i<19;i++){
      const a=pad.gap+.15+(Math.PI*2-.3)*i/18;
      art.beginPath(); art.moveTo(0,0); art.quadraticCurveTo(Math.cos(a)*r*.52,Math.sin(a)*r*.52,Math.cos(a)*r*.94,Math.sin(a)*r*.94); art.stroke();
    }
    art.strokeStyle='rgba(190,224,173,.16)'; art.beginPath(); art.arc(0,0,r*.91,pad.gap+.13,pad.gap+Math.PI*2-.13); art.stroke();
    for(let i=0;i<3;i++){
      const a=pad.seed*1.7+i*1.9, dx=Math.cos(a)*r*.45,dy=Math.sin(a)*r*.45;
      const bead=art.createRadialGradient(dx-r*.025,dy-r*.035,1,dx,dy,r*.075);
      bead.addColorStop(0,'rgba(246,255,229,.96)');bead.addColorStop(.24,'rgba(172,222,191,.8)');bead.addColorStop(1,'rgba(28,87,65,.72)');
      art.fillStyle=bead;art.beginPath();art.arc(dx,dy,r*.07,0,Math.PI*2);art.fill();
    }
    art.restore();
  }

  function drawBlossom(b) {
    const sceneScale=Math.max(.38,Math.min(1.08,width/1272));
    const x=b.x*width,y=b.y*height,s=b.r*sceneScale;
    art.save();art.translate(x,y);art.rotate(Math.sin(time*.2+b.seed)*.045);
    art.shadowColor='rgba(14,36,32,.3)';art.shadowBlur=s*.18;art.shadowOffsetY=s*.08;
    for(let layer=0;layer<3;layer++){
      const count=13-layer*2, offset=layer*Math.PI/count, len=s*(.84-layer*.17), wid=s*(.22-layer*.025);
      for(let i=0;i<count;i++){
        const a=i*Math.PI*2/count+offset;
        art.save();art.rotate(a);art.translate(0,-s*(.05+layer*.015));
        const g=art.createLinearGradient(0,-s*.08,0,-len);g.addColorStop(0,['#f4adc4','#f8c5d2','#fff0e5'][layer]);g.addColorStop(.75,['#df80a5','#eea5bb','#f8d6dd'][layer]);g.addColorStop(1,'rgba(255,237,231,.88)');
        art.fillStyle=g;art.strokeStyle='rgba(255,245,238,.5)';art.lineWidth=.7;
        art.beginPath();art.moveTo(-wid*.46,0);art.bezierCurveTo(-wid*.72,-len*.3,-wid*.52,-len*.88,0,-len);art.bezierCurveTo(wid*.52,-len*.88,wid*.72,-len*.3,wid*.46,0);art.closePath();art.fill();art.stroke();art.restore();
      }
    }
    art.shadowColor='transparent';const center=art.createRadialGradient(-s*.04,-s*.06,1,0,0,s*.22);center.addColorStop(0,'#f7f1a9');center.addColorStop(.55,'#e8c56d');center.addColorStop(1,'#a98f50');
    art.fillStyle=center;art.beginPath();art.arc(0,0,s*.2,0,Math.PI*2);art.fill();
    for(let i=0;i<22;i++){const a=i*2.4,r=s*(.045+(i%5)*.021);art.fillStyle=i%2?'#fff2bc':'#a9924f';art.beginPath();art.arc(Math.cos(a)*r,Math.sin(a)*r,s*.014,0,Math.PI*2);art.fill();}
    art.restore();
  }

  function drawKoi(f) {
    const scale=Math.max(.38,Math.min(1.08,width/1272)), len=f.length*scale*1.22;
    const x=f.x*width,y=f.y*height, angle=Math.atan2(f.vy,f.vx);
    const depth=.78+Math.sin(f.i*2.7+time*.12)*.2;
    const flap=Math.sin(time*4.6+f.phase)*.17;
    const unit=len/120;
    art.save();art.translate(x,y);art.rotate(angle);art.scale(unit,unit);art.globalAlpha=depth;
    // Broken, soft reflection and shadow just below the surface.
    art.save();art.translate(0,27);art.scale(1,-.64);art.globalAlpha=.14;art.filter='blur(3px)';
    art.fillStyle=f.color;art.beginPath();art.moveTo(-45,0);art.bezierCurveTo(-39,-12,-18,-16,8,-14);art.bezierCurveTo(29,-12,42,-7,49,0);art.bezierCurveTo(39,9,20,14,-4,15);art.bezierCurveTo(-27,14,-41,10,-45,0);art.fill();
    art.fillStyle=f.marks[0];art.globalAlpha=.08;art.beginPath();art.ellipse(-7,0,16,11,.2,0,Math.PI*2);art.fill();art.restore();
    // Soft submerged shadow follows the body and tail.
    art.save();art.globalAlpha=.18;art.filter='blur(5px)';art.fillStyle='#001719';
    art.beginPath();art.ellipse(-7,8,48,15,0,0,Math.PI*2);art.fill();
    art.beginPath();art.moveTo(-35,6);art.quadraticCurveTo(-57,-5,-72,-17+flap*16);art.quadraticCurveTo(-59,5,-76,20+flap*16);art.quadraticCurveTo(-49,18,-35,6);art.fill();art.restore();
    // Fine caudal rays and two flexible tail lobes.
    const fin=art.createLinearGradient(-36,0,-76,0);fin.addColorStop(0,'rgba(211,231,221,.42)');fin.addColorStop(1,'rgba(226,239,230,.08)');
    art.fillStyle=fin;art.beginPath();art.moveTo(-38,0);art.bezierCurveTo(-51,-6,-55,-17,-70,-25+flap*19);art.quadraticCurveTo(-64,-8,-78,0+flap*16);art.quadraticCurveTo(-63,8,-70,25+flap*19);art.bezierCurveTo(-54,17,-49,7,-38,0);art.fill();
    art.strokeStyle='rgba(239,249,238,.4)';art.lineWidth=.55;
    for(let i=-3;i<=3;i++){art.beginPath();art.moveTo(-39,0);art.quadraticCurveTo(-58,i*2.4,-75,i*7.1+flap*15);art.stroke();}
    // Pelvic and pectoral fins bend independently as the fish turns.
    art.globalAlpha=.52;art.fillStyle=f.fin;
    art.beginPath();art.moveTo(-15,5);art.bezierCurveTo(-18,12,-25,21+flap*4,-35,23);art.quadraticCurveTo(-30,12,-20,2);art.closePath();art.fill();
    art.beginPath();art.moveTo(13,4);art.bezierCurveTo(22,11,25,20-flap*5,35,23);art.quadraticCurveTo(28,8,17,0);art.closePath();art.fill();
    art.beginPath();art.moveTo(-24,-4);art.quadraticCurveTo(-32,-11,-37,-8);art.quadraticCurveTo(-34,-1,-26,3);art.fill();
    // Tapered koi body with a rounded shoulder, narrow peduncle and shaded belly.
    const body=art.createLinearGradient(0,-18,0,19);
    body.addColorStop(0,'#f8f6ed');body.addColorStop(.22,'#f4f2e8');body.addColorStop(.48,f.color);body.addColorStop(.78,'#c3c9bf');body.addColorStop(1,'#74847b');
    art.globalAlpha=depth;art.fillStyle=body;art.beginPath();
    art.moveTo(-48,0);art.quadraticCurveTo(-44,-8,-30,-13);art.bezierCurveTo(-18,-18,-5,-17,8,-15);art.bezierCurveTo(28,-14,42,-8,50,-2);art.quadraticCurveTo(54,0,50,3);art.bezierCurveTo(40,10,25,15,7,16);art.bezierCurveTo(-12,18,-30,15,-42,9);art.quadraticCurveTo(-49,5,-48,0);art.closePath();art.fill();
    // Gentle dorsal fin with visible rays.
    const dorsal=art.createLinearGradient(0,-24,0,-8);dorsal.addColorStop(0,'rgba(237,242,229,.2)');dorsal.addColorStop(1,'rgba(107,137,122,.62)');
    art.fillStyle=dorsal;art.beginPath();art.moveTo(-13,-15);art.bezierCurveTo(-10,-21,-7,-27,-2,-24);art.quadraticCurveTo(5,-20,11,-14);art.quadraticCurveTo(1,-10,-13,-11);art.closePath();art.fill();
    art.strokeStyle='rgba(255,255,247,.28)';art.lineWidth=.55;
    for(let i=0;i<5;i++){art.beginPath();art.moveTo(-11+i*4,-13);art.lineTo(-3+i*2.5,-23+i);art.stroke();}
    // Irregular sumi and hi markings follow the body instead of sitting as dots.
    art.save();art.beginPath();art.moveTo(-48,0);art.quadraticCurveTo(-44,-8,-30,-13);art.bezierCurveTo(-18,-18,-5,-17,8,-15);art.bezierCurveTo(28,-14,42,-8,50,-2);art.quadraticCurveTo(54,0,50,3);art.bezierCurveTo(40,10,25,15,7,16);art.bezierCurveTo(-12,18,-30,15,-42,9);art.quadraticCurveTo(-49,5,-48,0);art.clip();
    const patches=[[-25,-1,11,14],[-2,1,8,13],[20,-1,7,10]];
    f.marks.forEach((color,j)=>{
      const [cx,cy,rx,ry]=patches[(f.i+j*2)%patches.length];art.fillStyle=color;art.globalAlpha=depth*(color==='#343a37'?.93:.94);
      art.beginPath();art.moveTo(cx-rx*.78,cy-ry*.3);art.bezierCurveTo(cx-rx*1.15,cy-ry*1.12,cx-rx*.05,cy-ry*1.28,cx+rx*.52,cy-ry*.7);art.bezierCurveTo(cx+rx*1.1,cy-.2*ry,cx+rx*.9,cy+ry*.84,cx+rx*.12,cy+ry);art.bezierCurveTo(cx-rx*.62,cy+ry*.9,cx-rx*1.12,cy+ry*.28,cx-rx*.78,cy-ry*.3);art.closePath();art.fill();
    });
    art.restore();
    // Fine overlapping scales and lateral line break up the painted markings.
    art.save();art.beginPath();art.moveTo(-43,0);art.bezierCurveTo(-30,-16,27,-17,50,-2);art.quadraticCurveTo(54,0,50,3);art.bezierCurveTo(26,17,-30,16,-43,0);art.clip();
    for(let row=-2;row<=2;row++)for(let col=-5;col<=5;col++){
      const sx=col*7.2+((row+2)%2)*3.6,sy=row*5.7;
      art.globalAlpha=.16;art.strokeStyle=row<0?'#fffef0':'#66766d';art.lineWidth=.48;
      art.beginPath();art.arc(sx,sy,3.7,.08,Math.PI-.08);art.stroke();
    }
    art.globalAlpha=.2;art.strokeStyle='#66776d';art.lineWidth=.55;art.beginPath();art.moveTo(-35,4);art.quadraticCurveTo(-3,8,28,3);art.stroke();art.restore();
    // Gill plate, nose, reflective eye, mouth and fine barbels.
    art.globalAlpha=.5;art.strokeStyle='#766e61';art.lineWidth=.75;art.beginPath();art.moveTo(30,-10);art.quadraticCurveTo(35,0,30,10);art.stroke();
    art.fillStyle='#152b29';art.globalAlpha=.96;art.beginPath();art.arc(41,-4.4,2.25,0,Math.PI*2);art.fill();
    art.fillStyle='rgba(255,255,255,.95)';art.beginPath();art.arc(41.7,-5.15,.75,0,Math.PI*2);art.fill();
    art.strokeStyle='rgba(255,246,226,.78)';art.lineWidth=.7;art.beginPath();art.moveTo(49,2);art.quadraticCurveTo(54,3,57,7);art.moveTo(48,4);art.quadraticCurveTo(52,7,54,11);art.stroke();
    // A wet highlight rolls over the shoulder as the fish changes angle.
    art.globalAlpha=.31;art.strokeStyle='#fffef0';art.lineWidth=1.5;art.beginPath();art.moveTo(-28,-8);art.quadraticCurveTo(-6,-16,18,-10);art.stroke();
    art.restore();
  }

  function drawPetal(p) {
    const x=p.x*width+Math.sin(time*.21+p.phase)*13;
    const y=((p.y+time*p.drift)%1.04)*height;
    art.save();art.translate(x,y);art.rotate(p.rot+Math.sin(time*.7+p.phase)*.35);
    art.shadowColor='rgba(5,30,30,.32)';art.shadowBlur=4;
    const g=art.createLinearGradient(-p.size,-p.size,p.size,p.size);g.addColorStop(0,'#f5c9d4');g.addColorStop(1,'#d787a8');
    art.fillStyle=g;art.beginPath();art.moveTo(0,-p.size);art.bezierCurveTo(p.size*.75,-p.size*.7,p.size*.8,p.size*.15,0,p.size);art.bezierCurveTo(-p.size*.65,p.size*.35,-p.size*.8,-p.size*.45,0,-p.size);art.fill();
    art.strokeStyle='rgba(255,255,255,.28)';art.lineWidth=.5;art.beginPath();art.moveTo(0,-p.size*.6);art.quadraticCurveTo(1,0,0,p.size*.55);art.stroke();art.restore();
  }

  function fishPath(f) {
    const points=f.route, count=points.length;
    const progress=((time/f.cycle+f.phase+.035*Math.sin(time*.42+f.phase))%1)*count;
    const segment=Math.floor(progress), t=progress-segment, t2=t*t, t3=t2*t;
    const p0=points[(segment-1+count)%count],p1=points[segment%count],p2=points[(segment+1)%count],p3=points[(segment+2)%count];
    const sample=(axis)=>.5*((2*p1[axis])+(-p0[axis]+p2[axis])*t+(2*p0[axis]-5*p1[axis]+4*p2[axis]-p3[axis])*t2+(-p0[axis]+3*p1[axis]-3*p2[axis]+p3[axis])*t3);
    const tangent=(axis)=>.5*((-p0[axis]+p2[axis])+2*(2*p0[axis]-5*p1[axis]+4*p2[axis]-p3[axis])*t+3*(-p0[axis]+3*p1[axis]-3*p2[axis]+p3[axis])*t2);
    return { x:sample(0), y:sample(1), dx:tangent(0), dy:tangent(1) };
  }

  function moveFish(dt) {
    for(const f of fish){
      const path=fishPath(f); let offsetX=0,offsetY=0;
      if(pointer.active){
        const dx=pointer.x/width-path.x,dy=pointer.y/height-path.y;
        const distance=Math.hypot(dx*width,dy*height);
        const pull=.34*Math.exp(-distance/150);
        offsetX=dx*pull;offsetY=dy*pull;
      }
      const follow=1-Math.exp(-dt*1.15);
      f.followX+=(offsetX-f.followX)*follow;f.followY+=(offsetY-f.followY)*follow;
      f.x=path.x+f.followX+Math.sin(time*.65+f.phase*8)*.0015;
      f.y=path.y+f.followY+Math.sin(time*.83+f.phase*7)*.002;
      const dx=(f.x-f.lastX)*width,dy=(f.y-f.lastY)*height;
      const measuredSpeed=Math.min(68,Math.hypot(dx,dy)/Math.max(dt,.001));
      const desiredHeading=measuredSpeed>.35?Math.atan2(dy,dx):Math.atan2(path.dy*height,path.dx*width);
      if(!f.headingReady){f.heading=desiredHeading;f.headingReady=true;f.speedNow=f.speed;}
      else {
        const turn=Math.atan2(Math.sin(desiredHeading-f.heading),Math.cos(desiredHeading-f.heading));
        f.heading+=turn*(1-Math.exp(-dt*(2.8+Math.min(1.4,f.speedNow/28))));
        f.speedNow+=(Math.max(8,Math.min(48,measuredSpeed))-f.speedNow)*(1-Math.exp(-dt*1.8));
      }
      f.lastX=f.x;f.lastY=f.y;
      f.vx=Math.cos(f.heading);f.vy=Math.sin(f.heading);
      f.flapPhase+=dt*(3.1+Math.min(2.7,f.speedNow/20));
      if(time>f.nextWake){addImpulse((f.x-f.vx*.025)*width,(f.y-f.vy*.025)*height,.14);f.nextWake=time+2.4+f.i*.17;}
    }
  }

  function driftTabsWithFish(){
    const placed=[];
    for(const tab of floatingTabs){
      if(tab.element.matches(':hover')||document.activeElement===tab.element)continue;
      const f=fish[tab.fishIndex],w=tab.element.offsetWidth,h=tab.element.offsetHeight;
      let x=f.x*width-f.vx*62+Math.sin(time*.62+tab.phase)*3+(tab.index%2?1:-1)*Math.min(w*.3,44);
      const fishY=f.y*height,verticalGap=h*.5+45;
      let y=fishY<150?fishY+verticalGap:fishY-verticalGap+Math.sin(time*.9+tab.phase)*3;
      const minX=w*.58,maxX=width-w*.58;
      x=Math.max(minX,Math.min(maxX,x));y=Math.max(76,Math.min(height-h*.6,y));
      for(let pass=0;pass<3;pass++)for(const other of placed){
        if(Math.abs(x-other.x)<(w+other.w)*.5+10&&Math.abs(y-other.y)<(h+other.h)*.5+10){
          const sign=x<other.x?-1:1,candidate=other.x+sign*((w+other.w)*.5+14);
          const shifted=Math.max(minX,Math.min(maxX,candidate));
          if(Math.abs(shifted-other.x)>=(w+other.w)*.5+10)x=shifted;
          else {const down=y+(h+other.h)*.5+14,up=y-(h+other.h)*.5-14;y=down<=height-h*.6?down:Math.max(76,up);}
        }
      }
      tab.element.style.left=`${x}px`;
      tab.element.style.top=`${y}px`;
      tab.element.style.right='auto';tab.element.style.bottom='auto';
      const tilt=Math.max(-2.4,Math.min(2.4,f.vx*1.5));
      tab.element.style.transform=`translate(-50%,-50%) rotate(${tilt.toFixed(2)}deg)`;
      placed.push({x,y,w,h});
    }
  }

  function drawArt() {
    art.clearRect(0,0,width,height);
    if(!gl)for(const f of fish)drawKoi(f);
    for(const pad of pads)drawPad(pad);
    for(const petal of petals)drawPetal(petal);
    for(const blossom of blossoms)drawBlossom(blossom);
  }

  let rafId = 0;
  let isVisible = true;

  function render(now: number) {
    if (destroyed || !isVisible) {
      rafId = 0;
      return;
    }
    const dt=Math.min(.035,(now-lastFrame)/1000||.016);lastFrame=now;time+=dt;
    if(!reducedMotion){waveAccumulator+=dt;while(waveAccumulator>1/60){stepWater();waveAccumulator-=1/60;}moveFish(dt);driftTabsWithFish();}
    if(gl){uploadWater();}else{
      const g=art.createLinearGradient(0,0,width,height);g.addColorStop(0,'#0d3333');g.addColorStop(.55,'#164a47');g.addColorStop(1,'#082d2e');
      art.fillStyle=g;art.fillRect(0,0,width,height);
    }
    drawArt();
    rafId = requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries[0]?.isIntersecting ?? true;
      isVisible = visible;
      if (visible && !rafId && !destroyed) {
        lastFrame = performance.now();
        rafId = requestAnimationFrame(render);
      }
    },
    { threshold: 0.01 }
  );
  observer.observe(section);

  rafId = requestAnimationFrame(render);

  let lastTrail=0,lastVisualRipple=0;
  const onPointerMove = (event: PointerEvent) => {
    const rect=section.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;pointer.active=true;
    const now=performance.now();
    if(!reducedMotion&&now-lastTrail>105){addImpulse(pointer.x,pointer.y,.27);lastTrail=now;}
    if(!reducedMotion&&now-lastVisualRipple>210){addVisualRipple(pointer.x,pointer.y,.62);lastVisualRipple=now;}
  };
  const onPointerLeave = () => { pointer.active = false; };
  const onPointerDown = (event: PointerEvent) => {
    const rect=section.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    addImpulse(x,y,.9);addVisualRipple(x,y,1);
  };
  const onToggleDay = () => { day = !day; };

  section.addEventListener('pointermove', onPointerMove);
  section.addEventListener('pointerleave', onPointerLeave);
  section.addEventListener('pointerdown', onPointerDown);
  section.addEventListener('pond-toggle-day', onToggleDay);

  return () => {
    destroyed = true;
    if (rafId) cancelAnimationFrame(rafId);
    observer.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener('resize', resize);
    section.removeEventListener('pointermove', onPointerMove);
    section.removeEventListener('pointerleave', onPointerLeave);
    section.removeEventListener('pointerdown', onPointerDown);
    section.removeEventListener('pond-toggle-day', onToggleDay);
  };
}

