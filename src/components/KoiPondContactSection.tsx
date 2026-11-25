import React, { useEffect, useRef, useState } from "react";
import { initKoiPond } from "../lib/koiPondEngine";

export interface KoiPondContactSectionProps {
  email: string;
  fullName: string;
  onOpenContactModal?: () => void;
}

type DrawerCategory = "socials" | "email" | "whatsapp";

interface DrawerOption {
  name: string;
  mark: string;
  detail: string;
  href?: string;
  onClick?: () => void;
}

export const KoiPondContactSection: React.FC<KoiPondContactSectionProps> = ({
  email,
  fullName,
  onOpenContactModal,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const waterRef = useRef<HTMLCanvasElement>(null);
  const artRef = useRef<HTMLCanvasElement>(null);
  const socialsTabRef = useRef<HTMLButtonElement>(null);
  const emailTabRef = useRef<HTMLButtonElement>(null);
  const whatsappTabRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);

  const [isDay, setIsDay] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<DrawerCategory | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const waterCanvas = waterRef.current;
    const artCanvas = artRef.current;
    const tabs = [
      socialsTabRef.current,
      emailTabRef.current,
      whatsappTabRef.current,
    ].filter((el): el is HTMLButtonElement => Boolean(el));

    if (!section || !waterCanvas || !artCanvas) return;

    const destroy = initKoiPond({
      section,
      waterCanvas,
      artCanvas,
      floatingTabs: tabs,
    });

    return () => {
      destroy();
    };
  }, []);

  const handleToggleDay = () => {
    setIsDay((prev) => !prev);
    sectionRef.current?.dispatchEvent(new CustomEvent("pond-toggle-day"));
  };

  const openDrawer = (category: DrawerCategory) => {
    setActiveDrawer(category);
    if (drawerRef.current && !drawerRef.current.open) {
      drawerRef.current.showModal();
    }
  };

  const closeDrawer = () => {
    if (drawerRef.current?.open) {
      drawerRef.current.close();
    }
    setActiveDrawer(null);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const contactChoices: Record<
    DrawerCategory,
    { title: string; copy: string; items: DrawerOption[] }
  > = {
    socials: {
      title: "Find me online",
      copy: "Choose a platform to explore my work and connect.",
      items: [
        {
          name: "Instagram",
          mark: "◎",
          detail: "@anjalirajput.studio",
          href: "https://www.instagram.com/",
        },
        {
          name: "LinkedIn",
          mark: "in",
          detail: "Professional network",
          href: "https://www.linkedin.com/",
        },
        {
          name: "ReadCV",
          mark: "cv",
          detail: "Editorial archive",
          href: "https://read.cv/",
        },
        {
          name: "Awwwards",
          mark: "W.",
          detail: "Recognition & showcases",
          href: "https://www.awwwards.com/",
        },
      ],
    },
    email: {
      title: "Send an email",
      copy: "Reach out directly for brand strategy, viral reels, or creative direction.",
      items: [
        {
          name: copiedEmail ? "Copied!" : "Copy Address",
          mark: "⎘",
          detail: email,
          onClick: handleCopyEmail,
        },
        {
          name: "Direct Mail",
          mark: "@",
          detail: "Open email client",
          href: `mailto:${email}?subject=${encodeURIComponent(
            "Creative Collaboration Inquiry"
          )}`,
        },
        ...(onOpenContactModal
          ? [
              {
                name: "Commission Brief",
                mark: "✦",
                detail: "Open project inquiry form",
                onClick: () => {
                  closeDrawer();
                  onOpenContactModal();
                },
              },
            ]
          : []),
      ],
    },
    whatsapp: {
      title: "Quick Inquiry",
      copy: "Start a fast conversation for urgent campaigns or studio collaborations.",
      items: [
        {
          name: "WhatsApp Studio",
          mark: "wa",
          detail: "Direct studio chat",
          href: "https://wa.me/",
        },
        ...(onOpenContactModal
          ? [
              {
                name: "Project Brief",
                mark: "✉",
                detail: "Send a detailed message",
                onClick: () => {
                  closeDrawer();
                  onOpenContactModal();
                },
              },
            ]
          : []),
      ],
    },
  };

  const currentChoice = activeDrawer ? contactChoices[activeDrawer] : null;

  return (
    <div
      id="contact"
      className="koi-pond-wrapper relative left-1/2 -translate-x-1/2 w-screen max-w-[100vw] scroll-mt-0"
      data-mode={isDay ? "day" : "night"}
    >
      <style>{`
        @font-face {
          font-family: "Instrument Serif";
          src: url("/assets/fonts/instrument-serif-regular.woff2") format("woff2");
          font-style: normal;
          font-weight: 400;
          font-display: swap;
        }
        @font-face {
          font-family: "Instrument Serif";
          src: url("/assets/fonts/instrument-serif-italic.woff2") format("woff2");
          font-style: italic;
          font-weight: 400;
          font-display: swap;
        }
        .koi-pond-wrapper {
          --water-ink: #eff4e8;
          --water-pill: rgba(8, 34, 35, .54);
          --water-edge: rgba(242, 215, 189, .42);
          color: var(--water-ink);
        }
        .koi-pond-wrapper[data-mode="day"] {
          --water-pill: rgba(17, 63, 55, .46);
          --water-edge: rgba(255, 245, 223, .61);
        }
        .koi-pond-section {
          position: relative;
          isolation: isolate;
          width: 100%;
          height: 100svh;
          min-height: 560px;
          overflow: hidden;
          background: #123b39;
        }
        .koi-water, .koi-art {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .koi-water {
          z-index: 0;
          background: radial-gradient(ellipse at 50% 45%, #1d514d, #0c2d2d 76%);
        }
        .koi-art {
          z-index: 1;
          pointer-events: none;
        }
        .koi-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        .koi-greeting {
          position: absolute;
          top: 35%;
          left: 50%;
          width: max-content;
          max-width: 100vw;
          overflow: visible;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: .2em;
          white-space: nowrap;
          color: #f5efe4;
          font: 400 clamp(4.2rem, 11.8vw, 10.5rem)/.92 "Instrument Serif", Georgia, serif;
          letter-spacing: -.045em;
          text-shadow: 0 3px 30px rgba(4, 30, 30, .23);
          margin: 0;
        }
        .koi-greeting em {
          display: inline-block;
          margin-left: .035em;
          padding-right: .1em;
          margin-right: -.1em;
          transform: translateY(-.015em);
          font-size: .92em;
          font-style: normal;
          letter-spacing: -.025em;
          background: linear-gradient(110deg, #ffe3db 9%, #f2a7c6 62%, #e88ba9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .koi-subtitle {
          position: absolute;
          top: 58%;
          left: 50%;
          transform: translateX(-50%);
          width: min(560px, 85vw);
          color: rgba(244, 242, 233, .9);
          font-size: clamp(1rem, 1.55vw, 1.35rem);
          font-weight: 500;
          line-height: 1.45;
          letter-spacing: .02em;
          text-align: center;
          text-wrap: balance;
          text-shadow: 0 2px 14px rgba(0, 0, 0, .3);
          margin: 0;
        }
        .koi-cta {
          position: absolute;
          top: 71%;
          left: 50%;
          transform: translateX(-50%);
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 25px;
          border: 1px solid rgba(255, 220, 203, .78);
          border-radius: 999px;
          color: #fff7ee;
          background: linear-gradient(120deg, rgba(170, 92, 103, .78), rgba(125, 75, 100, .8));
          box-shadow: inset 0 1px rgba(255, 255, 255, .24), 0 8px 28px rgba(5, 24, 25, .25);
          backdrop-filter: blur(12px) saturate(130%);
          -webkit-backdrop-filter: blur(12px) saturate(130%);
          font: inherit;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: .01em;
          cursor: pointer;
          transition: transform .25s, box-shadow .25s, background .25s;
          pointer-events: auto;
        }
        .koi-cta:hover, .koi-cta:focus-visible {
          outline: none;
          transform: translate(-50%, -4px);
          background: linear-gradient(120deg, rgba(190, 105, 118, .94), rgba(145, 83, 115, .94));
          box-shadow: 0 0 0 4px rgba(251, 204, 196, .16), 0 12px 30px rgba(5, 24, 25, .32);
        }
        .koi-nav {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .koi-nav .koi-tab, .koi-day-toggle {
          pointer-events: auto;
          position: absolute;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 1px solid var(--water-edge);
          border-radius: 999px;
          padding: 0 22px;
          color: rgba(255, 250, 243, .92);
          background: var(--water-pill);
          box-shadow: inset 0 1px rgba(255, 255, 255, .1), 0 6px 18px rgba(2, 20, 22, .08);
          backdrop-filter: blur(10px) saturate(125%);
          -webkit-backdrop-filter: blur(10px) saturate(125%);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -.01em;
          transition: border-color .28s, background .28s, translate .28s, box-shadow .28s;
          cursor: pointer;
          font-family: inherit;
        }
        .koi-nav .koi-tab {
          animation: koi-float-tab 5.8s ease-in-out infinite;
          white-space: nowrap;
        }
        .koi-nav .koi-tab:hover {
          animation: none;
        }
        .koi-nav .koi-tab:hover, .koi-day-toggle:hover, .koi-day-toggle:focus-visible {
          outline: none;
          border-color: rgba(255, 225, 200, .9);
          background: rgba(15, 45, 45, .8);
          translate: 0 -4px;
          box-shadow: 0 0 0 4px rgba(251, 204, 196, .12), 0 9px 24px rgba(2, 20, 22, .18);
        }
        @keyframes koi-float-tab {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -5px; }
        }
        .koi-nav .socials-tab { left: 18%; top: 36%; border-color: rgba(229, 151, 182, .7); color: #ffe0e9; }
        .koi-nav .email-tab { left: 68%; top: 28%; border-color: rgba(212, 174, 90, .65); color: #f3d99f; animation-delay: -1.4s; }
        .koi-nav .whatsapp-tab { left: 76%; top: 70%; border-color: rgba(133, 201, 161, .68); color: #d6f1df; animation-delay: -3.1s; }
        .koi-day-toggle {
          top: 86px;
          left: 24px;
          min-height: 38px;
          padding: 0 16px;
          font-size: 12px;
          color: rgba(245, 244, 233, .85);
          border-color: rgba(224, 239, 230, .28);
          cursor: pointer;
        }
        .koi-footer-note {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          color: rgba(245, 244, 233, .52);
          letter-spacing: .04em;
          pointer-events: none;
          white-space: nowrap;
        }
        .koi-drawer {
          width: min(460px, calc(100vw - 32px));
          max-width: none;
          max-height: min(78vh, 620px);
          padding: 28px;
          overflow: auto;
          border: 1px solid rgba(244, 222, 204, .3);
          border-radius: 26px;
          color: #f8f3ea;
          background: linear-gradient(155deg, rgba(22, 62, 59, .97), rgba(8, 33, 35, .98));
          box-shadow: 0 24px 90px rgba(0, 14, 18, .48), inset 0 1px rgba(255, 255, 255, .08);
          pointer-events: auto;
          margin: auto;
        }
        .koi-drawer[open] {
          display: block;
          animation: koi-drawer-in .22s ease-out both;
        }
        .koi-drawer::backdrop {
          background: rgba(2, 19, 22, .48);
          backdrop-filter: blur(8px);
        }
        @keyframes koi-drawer-in {
          from { opacity: 0; transform: translateY(12px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .koi-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .koi-drawer-kicker {
          margin: 0;
          color: #edb4c8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
        }
        .koi-drawer-close {
          width: 38px;
          height: 38px;
          border: 1px solid rgba(247, 233, 220, .18);
          border-radius: 50%;
          color: #f8f3ea;
          background: rgba(255, 255, 255, .06);
          font-size: 22px;
          cursor: pointer;
          display: grid;
          place-items: center;
          line-height: 1;
        }
        .koi-drawer-close:hover, .koi-drawer-close:focus-visible {
          outline: 2px solid rgba(246, 197, 208, .65);
        }
        .koi-drawer h2 {
          margin: 18px 0 7px;
          font: 400 36px/1.05 "Instrument Serif", Georgia, serif;
          color: #f8f3ea;
        }
        .koi-drawer-copy {
          margin: 0 0 23px;
          color: rgba(244, 242, 233, .72);
          font-size: 13px;
          line-height: 1.5;
        }
        .koi-drawer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .koi-app-option {
          min-height: 72px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid rgba(242, 225, 207, .18);
          border-radius: 16px;
          color: #fbf7f0;
          background: rgba(255, 255, 255, .055);
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          transition: background .2s, border-color .2s, transform .2s;
        }
        .koi-app-option:hover, .koi-app-option:focus-visible {
          outline: none;
          transform: translateY(-2px);
          border-color: rgba(242, 180, 199, .65);
          background: rgba(255, 255, 255, .11);
        }
        .koi-app-mark {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: #fff;
          background: linear-gradient(145deg, rgba(218, 124, 153, .8), rgba(101, 82, 137, .8));
          font-size: 16px;
          font-weight: 700;
        }
        .koi-app-option:nth-child(2) .koi-app-mark { background: linear-gradient(145deg, #34363b, #111316); }
        .koi-app-option:nth-child(3) .koi-app-mark { background: linear-gradient(145deg, #2f83a5, #18536d); }
        .koi-app-option:nth-child(4) .koi-app-mark { background: linear-gradient(145deg, #496fba, #264889); }
        .koi-app-option-copy {
          min-width: 0;
          display: grid;
          gap: 4px;
        }
        .koi-app-option-copy strong {
          font-size: 13px;
          font-weight: 650;
          color: #fbf7f0;
        }
        .koi-app-option-copy small {
          color: rgba(244, 242, 233, .63);
          font-size: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (max-width: 700px) {
          .koi-greeting { top: 35%; font-size: clamp(3.8rem, 15vw, 6.5rem); }
          .koi-subtitle { top: 49%; width: 88vw; font-size: clamp(.86rem, 3.8vw, 1.08rem); }
          .koi-cta { top: 63%; min-height: 48px; padding-inline: 21px; font-size: 13px; }
          .koi-nav .socials-tab { top: 25%; left: 14%; }
          .koi-nav .email-tab { top: 36%; left: 72%; }
          .koi-nav .whatsapp-tab { top: 76%; left: 74%; }
          .koi-nav .koi-tab { min-height: 41px; padding-inline: 15px; font-size: 12px; }
          .koi-day-toggle { top: 76px; left: 14px; }
          .koi-drawer { padding: 22px; border-radius: 23px; }
          .koi-drawer h2 { font-size: 32px; }
          .koi-drawer-grid { grid-template-columns: 1fr; }
          .koi-app-option { min-height: 62px; gap: 9px; padding: 9px; }
          .koi-app-mark { width: 36px; height: 36px; flex-basis: 36px; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="koi-pond-section"
        aria-label={`${fullName}'s interactive koi pond contact section`}
      >
        <canvas ref={waterRef} className="koi-water" aria-hidden="true" />
        <canvas ref={artRef} className="koi-art" aria-hidden="true" />

        <div className="koi-content">
          <h2 className="koi-greeting">
            <span>contact</span>
            <em>me</em>
          </h2>
          <p className="koi-subtitle">
            For projects, questions, or a little hello, send me a message.
          </p>

          <button
            className="koi-cta"
            type="button"
            onClick={() => openDrawer("email")}
          >
            let’s connect <span aria-hidden="true">↗</span>
          </button>

          <button
            className="koi-day-toggle"
            type="button"
            aria-pressed={isDay}
            onClick={handleToggleDay}
          >
            {isDay ? "make it night" : "make it day"}
          </button>

          <div className="koi-nav" aria-label="Contact methods">
            <button
              ref={socialsTabRef}
              className="koi-tab socials-tab"
              type="button"
              onClick={() => openDrawer("socials")}
            >
              socials <span aria-hidden="true">↗</span>
            </button>
            <button
              ref={emailTabRef}
              className="koi-tab email-tab"
              type="button"
              onClick={() => openDrawer("email")}
            >
              email <span aria-hidden="true">↗</span>
            </button>
            <button
              ref={whatsappTabRef}
              className="koi-tab whatsapp-tab"
              type="button"
              onClick={() => openDrawer("whatsapp")}
            >
              whatsapp <span aria-hidden="true">↗</span>
            </button>
          </div>

          <span className="koi-footer-note font-mono">
            © 2027 {fullName} • Interactive Koi Pond Contact
          </span>

          <dialog
            ref={drawerRef}
            className="koi-drawer"
            aria-labelledby="koi-drawer-title"
            aria-describedby="koi-drawer-copy"
            onClick={(e) => {
              if (e.target === drawerRef.current) closeDrawer();
            }}
          >
            <div className="koi-drawer-head">
              <p className="koi-drawer-kicker">contact {fullName.split(" ")[0]}</p>
              <button
                className="koi-drawer-close"
                type="button"
                aria-label="Close app drawer"
                onClick={closeDrawer}
              >
                ×
              </button>
            </div>
            <h2 id="koi-drawer-title">{currentChoice?.title ?? "Find me online"}</h2>
            <p className="koi-drawer-copy" id="koi-drawer-copy">
              {currentChoice?.copy ?? "Choose a place to say hello."}
            </p>
            <div className="koi-drawer-grid">
              {currentChoice?.items.map((item, idx) =>
                item.href ? (
                  <a
                    key={idx}
                    className="koi-app-option"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="koi-app-mark" aria-hidden="true">
                      {item.mark}
                    </span>
                    <span className="koi-app-option-copy">
                      <strong>{item.name}</strong>
                      <small>{item.detail}</small>
                    </span>
                  </a>
                ) : (
                  <button
                    key={idx}
                    type="button"
                    className="koi-app-option"
                    onClick={item.onClick}
                  >
                    <span className="koi-app-mark" aria-hidden="true">
                      {item.mark}
                    </span>
                    <span className="koi-app-option-copy">
                      <strong>{item.name}</strong>
                      <small>{item.detail}</small>
                    </span>
                  </button>
                )
              )}
            </div>
          </dialog>
        </div>
      </section>
    </div>
  );
};

export default KoiPondContactSection;
