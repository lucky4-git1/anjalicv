/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
// Delivered by Originkit · stack: framer
// Paste into a Framer code component. Property controls included.
"use client"
import { animate, cancelFrame, frame, useMotionValue, useReducedMotion } from "framer-motion"
import type { Transition, ValueAnimationTransition } from "framer-motion"
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import type {
    CSSProperties,
    FocusEvent as ReactFocusEvent,
    KeyboardEvent as ReactKeyboardEvent,
    PointerEvent as ReactPointerEvent,
} from "react"

/*
 * CharcoalShuttle — a segmented control on a near-black track: a pane of
 * clear glass shuttles under the chosen label over a faint dot grid, the
 * track's own dots showing through it unchanged. One of four glass blocks
 * with the same ground, dots and glass (with VitreousBrim, HyalineLevel and
 * SeleniteChips). Cover → Solid makes the block one flat colour instead.
 *
 * Pick a label and it turns bright at once while the block glides across
 * to it, stretching or narrowing to the new label's width on the way; the
 * label it left turns muted at the same instant.
 *
 * Built after the segmented control in "Recording 2026-10-29 113321.mp4" (a
 * 922×288 screen recording of a design-tool control sheet, spec'd
 * "109 × 20 pt · r 4 · inset 2"), measured frame by frame at 30 fps:
 * - Track 109×20 pt, radius 4; the block is 16 pt tall at a 2 pt inset. In
 *   the clip's steady shot the track is 379×70 px, 3.5 px per pt, which is
 *   Scale 100 % (the same scale as the stepper in the same sheet).
 * - Segments are sized to their labels, not equal: Day 28.4, Week 35.3,
 *   Month 40.6 pt, each centred on its label, so the track hugs its labels
 *   and grows with them. The clip's padding wanders (38–48 px round the
 *   ink); 6 pt either side of each label's advance gives its 109 pt total
 *   exactly, with every segment within 4 px of the clip's.
 * - Labels 9 pt Inter Medium (ink widths 55 / 83 / 92 px, equal to the
 *   clip's). Chosen and unchosen share one weight (ink boxes equal to
 *   1 px); only the colour changes, near-black to the
 *   sheet's muted grey, and it changes within one frame of the click while
 *   the block is still on its way (the colour is not masked by the block).
 * - The block's two edges move with the same progress at every frame
 *   (0.30/0.30, 0.565/0.573 …), so it is one box gliding and resizing, not a
 *   stretch. Fitted over three slides (Day→Week, Week→Month, Month→Week):
 *   a 0.24 s tween on cubic-bezier(0.35, 0.8, 0.5, 1), 1.8 % rms.
 * - The dot grid of the sheet (2 pt square lattice, ~0.3 pt dots, faint),
 *   continuous under the block and the track. Here it runs edge to edge,
 *   every gap the same.
 *
 * Dark theme, as SlateNotch: the sheet's #FAFAFA page, #E1E1E1 track and
 * white block become a black page, a track a step lighter than it and a
 * near-black block a step lighter again; the chosen label is near-white and
 * the rest muted grey; the dots keep their faintness.
 *
 * How it is built: the track, its dots and the block are one SVG. The track
 * and every dot are drawn once on the screen's pixel grid (device pixel
 * ratio × any canvas zoom); the block's layers are rects whose x and width
 * are written straight from two motion values each frame, and the glass is
 * clear, so the dots stay put in track space as the block slides over
 * them. Its gradients run top to bottom in track space, so gliding and
 * resizing never rebuild them. Nothing is laid out or re-rendered per frame, and nothing
 * runs at rest. Labels are real radio buttons; their widths come from the
 * browser's own layout.
 */

// ---------------------------------------------------------------- constants

// The clip's frame. Lengths below are in pt, the clip's own spec unit.
const REF_W = 922
const REF_H = 288
const REF_ASPECT = REF_W / REF_H
const PT = 3.5 // clip px per pt at Scale 100 %
const REDUCED: Transition = { type: "tween", ease: "linear", duration: 0 }
// Hover: a label lifts most of the way to the chosen ink, easing in quickly
// and settling back a little slower so leaving never reads as a snap.
const HOVER_LIFT = 0.72
const HOVER_IN = "opacity 260ms cubic-bezier(0.25, 1, 0.5, 1)"
const HOVER_OUT = "opacity 380ms cubic-bezier(0.33, 0, 0.2, 1)"

const WEB_FONT = "Inter"
const WEB_FONT_CSS = "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
const FALLBACK_STACK = '"Inter", "SF Pro Text", system-ui, sans-serif'

// ---------------------------------------------------------------- types

interface FontValue {
    fontFamily?: string
    fontWeight?: number | string
    fontStyle?: string
    fontSize?: string | number
    letterSpacing?: string | number
}

export interface Colors {
    track: string
    /** Hairline round the track, so it holds its edge on a black page. */
    edge: string
    /** The block's tint when Cover is Glass. Keep it translucent; the dots show through. */
    glass: string
    /** The block when Cover is Solid. */
    solid: string
    /** Labels that are not chosen. */
    muted: string
    /** Grid dots on the track, seen through the glass as they are; transparent hides them. */
    dots: string
}

export interface Placement {
    x: number
    y: number
}

export interface Advanced {
    trackHeight: number
    inset: number
    padding: number
    edgeWidth: number
    dotPitch: number
    dotSize: number
    labelFade: number
    sheen: number
    rim: number
    rimWidth: number
    shade: number
}

export interface CharcoalShuttleProps {
    /** The labels, left to right. */
    items?: string[]
    /** Which label starts chosen, counting from 1. */
    selected?: number
    /** Selected, as the panel shows it for 2…7 labels (its range is 1 to that count). Used over `selected` when the labels number that many. */
    selected2?: number
    selected3?: number
    selected4?: number
    selected5?: number
    selected6?: number
    selected7?: number
    background?: string
    font?: FontValue
    /** The chosen label. */
    textColor?: string
    /** How big the control draws in its frame. 100 % is the clip's framing. */
    scale?: number
    /** Track corner radius in pt; the block follows it, less the inset. */
    radius?: number
    /** The block: clear glass over the track's dots, or one solid colour (Colors → Solid). */
    cover?: "glass" | "solid"
    colors?: Partial<Colors>
    placement?: Partial<Placement>
    /** Drives the block's glide (position and width together). */
    transition?: Transition
    advanced?: Partial<Advanced>
    /** Called with the chosen index (from 0) and label (code use). */
    onChange?: (index: number, label: string) => void
    style?: CSSProperties
}

// ---------------------------------------------------------------- defaults

const DEFAULT_ITEMS = ["Day", "Week", "Month"]
const DEFAULT_FONT: FontValue = { fontFamily: WEB_FONT, fontWeight: 500 }
const DEFAULT_COLORS: Colors = {
    track: "#121214",
    edge: "rgba(255, 255, 255, 0.08)",
    glass: "rgba(255, 255, 255, 0.14)",
    solid: "#3A3A3C",
    muted: "#8E8E93",
    dots: "rgba(255, 255, 255, 0.12)",
}
const DEFAULT_PLACEMENT: Placement = { x: 0, y: 0 }
const FONT_BASE_PX = 16 // Font → Size that draws labels at the clip's size
const TEXT_PT = 9 // the clip's label size in pt (Inter Medium), at Font size 16 px

const DEFAULT_ADVANCED: Advanced = {
    trackHeight: 20,
    inset: 2,
    padding: 6,
    edgeWidth: 0.25,
    dotPitch: 2,
    dotSize: 0.3,
    labelFade: 0,
    sheen: 30,
    rim: 70,
    rimWidth: 0.35,
    shade: 22,
}

// Fitted to the clip; see the header.
const DEFAULT_TRANSITION: Transition = { type: "tween", ease: [0.35, 0.8, 0.5, 1], duration: 0.24 }

// ---------------------------------------------------------------- helpers

// A colour row left empty falls back to its default.
function mergeColors(colors: Partial<Colors> | undefined): Colors {
    const out = { ...DEFAULT_COLORS } as Colors
    for (const k of Object.keys(DEFAULT_COLORS) as (keyof Colors)[]) out[k] = colors?.[k] || DEFAULT_COLORS[k]
    return out
}

/** The glyph colour that reads on a fill: near-black on fills brighter than `cut` (relative luminance), white otherwise. */
function inkOn(fill: string, fallback: string, cut = 0.4) {
    const s = String(fill || "").trim()
    let rgb: number[] | null = null
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})([0-9a-f]{2})?$/i.exec(s)
    if (hex) {
        const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1]
        rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
    } else {
        const m = /^rgba?\(([^)]+)\)/i.exec(s)
        if (m) rgb = m[1].split(",").slice(0, 3).map((v) => parseFloat(v))
    }
    if (!rgb || rgb.some((v) => !Number.isFinite(v))) return fallback
    const [r, g, b] = rgb.map((v) => {
        const c = v / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > cut ? "#141415" : "#FFFFFF"
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

// The Font control may hand over a ready-made stack ("Inter", "Inter
// Placeholder", sans-serif); a bare name gets quoted.
function familyStack(family: string): string {
    if (family === WEB_FONT) return FALLBACK_STACK
    return /[",]/.test(family) ? `${family}, ${FALLBACK_STACK}` : `"${family}", ${FALLBACK_STACK}`
}

// The grid over the whole track, no padding: a square lattice whose pitch is
// a whole number of device pixels, so every gap is the same, with the slack
// split evenly between the two ends (half a gap to a gap each side). Dots
// the rounded corners cut off are left out. Each dot's top left, in px.
function gridDots(w: number, h: number, r: number, pitch: number, side: number, dev: number): [number, number][] {
    const p = Math.max(1, Math.round(pitch * dev))
    const s = Math.max(1, Math.round(side * dev))
    const W = Math.round(w * dev)
    const H = Math.round(h * dev)
    const nx = Math.floor((W - s) / p)
    const ny = Math.floor((H - s) / p)
    if (nx < 1 || ny < 1) return []
    const ox = Math.floor((W - (nx - 1) * p - s) / 2)
    const oy = Math.floor((H - (ny - 1) * p - s) / 2)
    const out: [number, number][] = []
    for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
            const x = (ox + i * p) / dev
            const y = (oy + j * p) / dev
            const ex = Math.max(0, r - Math.min(x + side / 2, w - x - side / 2))
            const ey = Math.max(0, r - Math.min(y + side / 2, h - y - side / 2))
            if (ex > 0 && ey > 0 && Math.hypot(ex, ey) > r - side) continue
            out.push([x, y])
        }
    }
    return out
}

interface Seg {
    x: number
    w: number
}

// How many labels the panel's Items row holds, as the component counts them
// (blank rows skipped, the defaults when none are left).
function itemCount(items: unknown): number {
    const named = Array.isArray(items) ? items.filter((s) => typeof s === "string" && s.trim()).length : 0
    return named || DEFAULT_ITEMS.length
}

// Selected is one row per label count, each a 1…count stepper shown only
// while Items holds that many: a control's max cannot follow another control.
// Written out in full so the builder's Save defaults can still bake them.
// Glass-only Advanced rows hide on a solid block (Framer passes the root props second).
const hideOnSolid = (p: { cover?: string }, root?: { cover?: string }) => (root ?? p)?.cover === "solid"
const SELECTED_NOTE = "Which label starts chosen, counting from the left."

// ---------------------------------------------------------------- component

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 922
 * @framerIntrinsicHeight 288
 */
export default function CharcoalShuttle(props: CharcoalShuttleProps) {
    const {
        items: itemsProp = DEFAULT_ITEMS,
        font,
        scale = 125,
        radius = 4,
        cover = "glass",
        colors,
        placement,
        transition = DEFAULT_TRANSITION,
        advanced,
        onChange,
        style,
    } = props
    const named = (itemsProp ?? []).filter((s) => typeof s === "string" && s.trim())
    const items = named.length ? named : DEFAULT_ITEMS
    const n = items.length
    // The panel shows one Selected row per label count, so its range always
    // ends at the last label; read the row that matches this count.
    const perCount = n >= 2 && n <= 7 ? props[`selected${n}` as `selected${2 | 3 | 4 | 5 | 6 | 7}`] : undefined
    const selected = typeof perCount === "number" ? perCount : props.selected ?? 1
    const background = props.background || "#000000"
    const textColor = props.textColor || "#F4F4F5"
    const col = mergeColors(colors)
    const pl = { ...DEFAULT_PLACEMENT, ...placement }
    const adv = { ...DEFAULT_ADVANCED, ...advanced }
    const f = { ...DEFAULT_FONT, ...font }
    // Font → Size scales the labels around its 16 px default (32 px doubles
    // them) from the clip's 9 pt. The track, the block, their
    // padding and corners grow in step, so bigger text gets a bigger box.
    const fontPx = typeof f.fontSize === "string" ? parseFloat(f.fontSize) : f.fontSize
    const ts = TEXT_PT * (typeof fontPx === "number" && fontPx > 0 ? fontPx / FONT_BASE_PX : 1)
    const grow = ts / TEXT_PT
    // The block keeps the size Track Height gives it at the clip's 2 pt inset;
    // Block Inset then grows the track around it rather than squeezing it.
    const insetPt = Math.max(0, adv.inset) * grow
    const trackHeightPt = (Math.max(6, adv.trackHeight - 2 * DEFAULT_ADVANCED.inset) * grow) + 2 * insetPt
    const padPt = Math.max(0, adv.padding) * grow
    const glass = cover !== "solid"
    // On a solid block the chosen label follows the fill, unless a text colour was set.
    const chosenInk = !glass && (!props.textColor || String(props.textColor).toUpperCase() === "#F4F4F5") ? inkOn(col.solid, textColor) : textColor
    const reduced = !!useReducedMotion()
    const family =
        f.fontFamily && !/^(sans-serif|system-ui)$/i.test(String(f.fontFamily).trim()) ? String(f.fontFamily) : WEB_FONT
    // Prefixed, so another component on the page can never lend this one its clip.
    const uid = "shuttle" + useId().replace(/[^a-zA-Z0-9_-]/g, "")

    const rootRef = useRef<HTMLDivElement>(null)
    const rowRef = useRef<HTMLDivElement>(null)
    const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
    const [size, setSize] = useState({ w: REF_W, h: REF_H })
    const [dpr, setDpr] = useState(1)
    const [shown, setShown] = useState(1)
    const [focusRing, setFocusRing] = useState(false)
    const [hoverIdx, setHoverIdx] = useState(-1)

    const clampIdx = (i: number) => Math.min(n - 1, Math.max(0, Math.round(i)))
    const [sel, setSel] = useState(() => clampIdx(selected - 1))
    const selIdx = clampIdx(sel)
    useEffect(() => {
        setSel(clampIdx(selected - 1))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, n])

    // ---------------------------------------------------------- frame

    const measureShown = () => {
        const root = rootRef.current
        if (!root || !root.offsetWidth) return
        const s = root.getBoundingClientRect().width / root.offsetWidth
        if (s > 0.05 && s < 20) setShown((q) => (Math.abs(q - s) > 0.004 ? s : q))
    }

    useIsoLayoutEffect(() => {
        const root = rootRef.current
        if (!root) return
        // Measure before the first paint. The host remounts the component
        // when some controls change (Cover → Glass / Solid); waiting for the
        // observer drew one or two frames at the 922×288 reference size,
        // zoomed and cropped, before it snapped back.
        const cs = getComputedStyle(root)
        const w0 = parseFloat(cs.width)
        const h0 = parseFloat(cs.height)
        if (w0 > 0 && h0 > 0) setSize((s) => (s.w === w0 && s.h === h0 ? s : { w: w0, h: h0 }))
        measureShown()
        const ro = new ResizeObserver((es) => {
            const r = es[0].contentRect
            if (r.width > 0 && r.height > 0) setSize((s) => (s.w === r.width && s.h === r.height ? s : { w: r.width, h: r.height }))
            measureShown()
        })
        ro.observe(root)
        return () => ro.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useIsoLayoutEffect(() => {
        const upd = () => setDpr(Math.min(4, Math.max(1, window.devicePixelRatio || 1)))
        upd()
        window.addEventListener("resize", upd)
        return () => window.removeEventListener("resize", upd)
    }, [])

    // The default face comes from Google Fonts; Framer loads any other itself.
    useEffect(() => {
        if (family !== WEB_FONT || document.querySelector("link[data-charcoal-shuttle-font]")) return
        const l = document.createElement("link")
        l.rel = "stylesheet"
        l.href = WEB_FONT_CSS
        l.dataset.charcoalShuttleFont = "1"
        document.head.appendChild(l)
    }, [family])

    // ---------------------------------------------------------- geometry

    // One unit for the whole composition: the clip's frame, contained.
    const u = Math.min(size.h, size.w / REF_ASPECT) / REF_H
    const k = u * PT * Math.max(0.05, scale / 100) // layout px per pt
    const dev = dpr * shown // device px per layout px
    const snap = (v: number) => Math.round(v * dev) / dev
    const hair = (pt: number) => Math.max(1, Math.round(pt * k * dev)) / dev // never under one device px
    const px = (v: number) => `${(v * k).toFixed(3)}px`

    const th = snap(trackHeightPt * k)
    const inset = snap(insetPt * k)
    const blockH = Math.max(0, th - 2 * inset)

    // Segment boxes in layout px along the label row, from the browser's own
    // layout of the labels (padding included). Estimated until measured.
    const est = (s: string) => (s.length * 0.62 * ts + 2 * padPt) * k
    const [segs, setSegs] = useState<Seg[]>(() => {
        let x = 0
        return items.map((s) => {
            const w = est(s)
            const out = { x, w }
            x += w
            return out
        })
    })
    useIsoLayoutEffect(() => {
        const els = btnRefs.current.slice(0, n)
        const measure = () => {
            const next = els.map((el) => (el ? { x: el.offsetLeft, w: el.offsetWidth } : { x: 0, w: 0 }))
            setSegs((s) =>
                s.length === next.length && s.every((g, i) => Math.abs(g.x - next[i].x) < 0.01 && Math.abs(g.w - next[i].w) < 0.01)
                    ? s
                    : next
            )
        }
        measure()
        const ro = new ResizeObserver(measure)
        for (const el of els) if (el) ro.observe(el)
        // A web font arriving changes the widths without resizing anything observed first.
        document.fonts?.ready.then(measure).catch(() => {})
        return () => ro.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [n, k, family, f.fontWeight, f.fontStyle, f.letterSpacing, ts, padPt, items.join("\n")])

    const rowW = segs.length ? segs[segs.length - 1].x + segs[segs.length - 1].w : 0
    const tw = snap(rowW + 2 * inset)
    // Radius is the track corner at the clip's 2 pt inset. Any other inset moves
    // the track corner with it, so the block keeps its own corners (Radius less
    // 2 pt) and the two stay nested, flush at 0 as much as wide at 6.
    const trackR = Math.min(th / 2, Math.max(0, Math.max(0, radius) + adv.inset - DEFAULT_ADVANCED.inset) * grow * k)
    const blockR = Math.min(blockH / 2, Math.max(0, trackR - inset))

    const cx = snap(size.w / 2 + (pl.x / 100) * size.w)
    const cy = snap(size.h / 2 + (pl.y / 100) * size.h)
    const turn = `translate(${cx}px, ${cy}px)`

    // ---------------------------------------------------------- the block

    // Left edge and width of the block in track px.
    const mL = useMotionValue(inset + (segs[selIdx]?.x ?? 0))
    const mW = useMotionValue(segs[selIdx]?.w ?? 0)
    const placed = useRef(false)
    const trRef = useRef(transition)
    trRef.current = reduced ? REDUCED : transition

    // Glide on a new choice; jump when only the geometry changed.
    const lastSel = useRef(selIdx)
    useIsoLayoutEffect(() => {
        const g = segs[selIdx]
        if (!g) return
        const toL = inset + g.x
        const moved = lastSel.current !== selIdx
        lastSel.current = selIdx
        if (!placed.current || !moved || reduced) {
            placed.current = true
            if (!mL.isAnimating() || !moved) {
                mL.jump(toL)
                mW.jump(g.w)
            }
            return
        }
        const tr = trRef.current as ValueAnimationTransition<number>
        animate(mL, toL, tr)
        animate(mW, g.w, tr)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selIdx, segs, inset])

    // Every layer of the block, each with how far inside its edge it sits
    // (the glass rim's stroke runs half its width in).
    const blockRefs = useRef<({ el: SVGRectElement; d: number } | null)[]>([])
    const geo = useRef({ dev, blockR, inset, blockH })
    geo.current = { dev, blockR, inset, blockH }
    const draw = useRef(() => {})
    draw.current = () => {
        const g = geo.current
        const moving = mL.isAnimating() || mW.isAnimating()
        // On the pixel grid at rest; free while gliding, so it moves smoothly.
        const sn = (v: number) => (moving ? v : Math.round(v * g.dev) / g.dev)
        const l = sn(mL.get())
        const w = Math.max(0, sn(mL.get() + mW.get()) - l)
        const r = Math.min(g.blockR, w / 2)
        for (const b of blockRefs.current) {
            if (!b) continue
            b.el.setAttribute("x", (l + b.d).toFixed(3))
            b.el.setAttribute("width", Math.max(0, w - 2 * b.d).toFixed(3))
            b.el.setAttribute("rx", Math.max(0, r - b.d).toFixed(3))
        }
    }
    useEffect(() => {
        const run = () => draw.current()
        const kick = () => frame.render(run)
        const offs = [mL, mW].flatMap((m) => [m.on("change", kick), m.on("animationComplete", kick)])
        return () => {
            offs.forEach((off) => off())
            cancelFrame(run)
        }
    }, [mL, mW])
    useIsoLayoutEffect(() => {
        draw.current()
    })

    // ---------------------------------------------------------- input

    const choose = (i: number) => {
        const j = clampIdx(i)
        if (j === selIdx) return
        setSel(j)
        onChange?.(j, items[j])
    }
    const onPick = (i: number) => (e: ReactPointerEvent<HTMLButtonElement>) => {
        if (e.pointerType === "mouse" && e.button !== 0) return
        // Chosen on press, as in the clip; no focus ring from a pointer.
        e.preventDefault()
        choose(i)
    }
    const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
        let to = -1
        if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (selIdx + 1) % n
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (selIdx - 1 + n) % n
        else if (e.key === "Home") to = 0
        else if (e.key === "End") to = n - 1
        if (to < 0) return
        e.preventDefault()
        choose(to)
        btnRefs.current[to]?.focus()
    }
    const onFocus = (e: ReactFocusEvent<HTMLButtonElement>) => {
        let visible = true
        try {
            visible = e.currentTarget.matches(":focus-visible")
        } catch {
            // older engines: treat every focus as visible
        }
        setFocusRing(visible)
    }

    // ---------------------------------------------------------- the drawn track

    const pitch = Math.max(0.5, adv.dotPitch) * k
    const dotSide = hair(Math.max(0, adv.dotSize))
    const edgeW = adv.edgeWidth > 0 ? hair(adv.edgeWidth) : 0
    const rimW = hair(Math.max(0, adv.rimWidth))
    const id = (s: string) => `${uid}-${s}`

    const chrome = useMemo(() => {
        const lattice = gridDots(tw, th, trackR, pitch, dotSide, dev).map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={dotSide} height={dotSide} />
        ))
        // One layer of the block, d inside its edge.
        const blockRect = (slot: number, d: number, extra: Record<string, string | number>) => (
            <rect
                ref={(el) => {
                    blockRefs.current[slot] = el ? { el, d } : null
                }}
                x={0}
                y={inset + d}
                width={0}
                height={Math.max(0, blockH - 2 * d)}
                {...extra}
            />
        )
        const rim = adv.rim / 100
        const top = inset
        const foot = inset + blockH
        return (
            <svg
                aria-hidden="true"
                width={tw}
                height={th}
                viewBox={`0 0 ${tw} ${th}`}
                shapeRendering="geometricPrecision"
                style={{ position: "absolute", left: 0, top: 0, display: "block", pointerEvents: "none" }}
            >
                <defs>
                    {/* The glass: the same four layers as the other glass blocks,
                        every gradient top to bottom in track space, so the
                        block can glide and resize under them. */}
                    {glass && (
                        <>
                            <linearGradient id={id("tint")} gradientUnits="userSpaceOnUse" x1={0} y1={top} x2={0} y2={foot}>
                                <stop offset="0" stopColor={col.glass} />
                                <stop offset="1" stopColor={col.glass} stopOpacity={0.5} />
                            </linearGradient>
                            {/* Specular: a soft band of light across the top. */}
                            <linearGradient id={id("sheen")} gradientUnits="userSpaceOnUse" x1={0} y1={top} x2={0} y2={foot}>
                                <stop offset="0" stopColor="#FFFFFF" stopOpacity={adv.sheen / 100} />
                                <stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0} />
                            </linearGradient>
                            {/* Depth: the foot of the pane sits a little darker. */}
                            <linearGradient id={id("shade")} gradientUnits="userSpaceOnUse" x1={0} y1={top} x2={0} y2={foot}>
                                <stop offset="0.55" stopColor="#000000" stopOpacity={0} />
                                <stop offset="1" stopColor="#000000" stopOpacity={Math.max(0, adv.shade) / 100} />
                            </linearGradient>
                            {/* Rim: bright along the top, faint down the sides, catching again at the foot. */}
                            <linearGradient id={id("rim")} gradientUnits="userSpaceOnUse" x1={0} y1={top} x2={0} y2={foot}>
                                <stop offset="0" stopColor="#FFFFFF" stopOpacity={rim} />
                                <stop offset="0.25" stopColor="#FFFFFF" stopOpacity={rim * 0.3} />
                                <stop offset="0.6" stopColor="#FFFFFF" stopOpacity={rim * 0.1} />
                                <stop offset="1" stopColor="#FFFFFF" stopOpacity={rim * 0.4} />
                            </linearGradient>
                        </>
                    )}
                </defs>
                <rect x={0} y={0} width={tw} height={th} rx={trackR} ry={trackR} fill={col.track} />
                <g fill={col.dots}>{lattice}</g>
                {glass ? (
                    // Clear glass: the track and its dots show through as they are.
                    <>
                        {blockRect(1, 0, { fill: `url(#${id("tint")})` })}
                        {blockRect(2, 0, { fill: `url(#${id("sheen")})` })}
                        {blockRect(3, 0, { fill: `url(#${id("shade")})` })}
                        {blockRect(4, rimW / 2, { fill: "none", stroke: `url(#${id("rim")})`, strokeWidth: rimW })}
                    </>
                ) : (
                    blockRect(0, 0, { fill: col.solid })
                )}
                {/* Inside stroke, over the block so a flush block (inset 0) keeps the edge: centred half a stroke in, so it never spills past the track. */}
                <rect
                    x={edgeW / 2}
                    y={edgeW / 2}
                    width={Math.max(0, tw - edgeW)}
                    height={Math.max(0, th - edgeW)}
                    rx={Math.max(0, trackR - edgeW / 2)}
                    fill="none"
                    stroke={col.edge}
                    strokeWidth={edgeW}
                />
            </svg>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid, tw, th, inset, blockH, trackR, pitch, dev, dotSide, edgeW, rimW, glass, k, adv.sheen, adv.rim, adv.shade, col.track, col.edge, col.solid, col.glass, col.dots])

    // ---------------------------------------------------------- render

    return (
        <div
            ref={rootRef}
            onPointerEnter={measureShown}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                aspectRatio: `${REF_W} / ${REF_H}`,
                overflow: "hidden",
                background,
                ...style,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                    transformOrigin: "0 0",
                    transform: turn,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: snap(-tw / 2),
                        top: snap(-th / 2),
                        width: tw,
                        height: th,
                        borderRadius: trackR,
                        boxShadow: focusRing ? `0 0 0 ${hair(0.6)}px ${textColor}` : "none",
                    }}
                >
                    {chrome}
                    <div
                        ref={rowRef}
                        role="radiogroup"
                        onKeyDown={onKey}
                        style={{
                            position: "absolute",
                            left: inset,
                            top: 0,
                            height: th,
                            display: "flex",
                            alignItems: "stretch",
                            fontFamily: familyStack(family),
                            fontWeight: f.fontWeight ?? 500,
                            fontStyle: f.fontStyle,
                            letterSpacing: f.letterSpacing,
                            fontSize: px(ts),
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                            userSelect: "none",
                            WebkitUserSelect: "none",
                        }}
                    >
                        {items.map((label, i) => {
                            const on = i === selIdx
                            return (
                                <button
                                    key={i}
                                    ref={(el) => {
                                        btnRefs.current[i] = el
                                    }}
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    tabIndex={on ? 0 : -1}
                                    onPointerDown={onPick(i)}
                                    onClick={(e) => {
                                        // Keyboard activation (Enter / Space) arrives as a click with no pointer.
                                        if (e.detail === 0) choose(i)
                                    }}
                                    onFocus={onFocus}
                                    onBlur={() => setFocusRing(false)}
                                    onPointerEnter={(e) => e.pointerType === "mouse" && setHoverIdx(i)}
                                    onPointerLeave={() => setHoverIdx((h) => (h === i ? -1 : h))}
                                    style={{
                                        flex: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: `0 ${px(padPt)}`,
                                        margin: 0,
                                        border: "none",
                                        background: "transparent",
                                        font: "inherit",
                                        color: on ? chosenInk : col.muted,
                                        transition: adv.labelFade > 0 ? `color ${adv.labelFade}ms linear` : "none",
                                        cursor: on ? "default" : "pointer",
                                        outline: "none",
                                        touchAction: "manipulation",
                                        WebkitTapHighlightColor: "transparent",
                                    }}
                                >
                                    {/* The hover lift is its own layer of the bright ink, cross-faded on
                                        opacity, so it eases in and out on its own curve while a click
                                        still switches colour at once. Driving it through the label's
                                        own colour snapped (Label Fade 0) under a 150 ms opacity dip. */}
                                    <span style={{ position: "relative" }}>
                                        {label}
                                        <span
                                            aria-hidden
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                color: textColor,
                                                opacity: !on && hoverIdx === i ? HOVER_LIFT : 0,
                                                transition: on || reduced ? "none" : hoverIdx === i ? HOVER_IN : HOVER_OUT,
                                                pointerEvents: "none",
                                            }}
                                        >
                                            {label}
                                        </span>
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------- controls

// Control order arranged in the builder.

