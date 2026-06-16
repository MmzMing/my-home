import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface OpeningAnimationProps {
  children: ReactNode;
}

const DATA_ANIMATE_AVATAR = "[data-animate='avatar']";
const DATA_ANIMATE_NAME = "[data-animate='name']";
const DATA_ANIMATE_BIO = "[data-animate='bio']";
const DATA_ANIMATE_BUTTON = "[data-animate='button']";
const DATA_ANIMATE_CLOCK = "[data-animate='clock']";
const DATA_ANIMATE_FOOTER = "[data-animate='footer']";
const OPENING_CURTAIN = ".opening-curtain";
const OPENING_BG = ".opening-bg";

function setInitialHiddenStates() {
  gsap.set(DATA_ANIMATE_AVATAR, {
    opacity: 0,
    scale: 0.92,
    clipPath: "circle(0% at 50% 50%)",
    rotateX: 12,
  });
  gsap.set(DATA_ANIMATE_NAME, {
    opacity: 0,
    y: 50,
    scaleX: 1.25,
    filter: "blur(8px)",
  });
  gsap.set(DATA_ANIMATE_BIO, {
    opacity: 0,
    y: 40,
  });
  gsap.set(DATA_ANIMATE_BUTTON, {
    opacity: 0,
    y: 40,
  });
  gsap.set(DATA_ANIMATE_CLOCK, {
    opacity: 0,
    y: 30,
  });
  gsap.set(DATA_ANIMATE_FOOTER, {
    opacity: 0,
  });
  gsap.set(OPENING_BG, {
    scale: 1.08,
    opacity: 0,
  });
}

function revealAllStatically() {
  gsap.set(DATA_ANIMATE_AVATAR, {
    opacity: 1,
    scale: 1,
    clipPath: "circle(100% at 50% 50%)",
    rotateX: 0,
  });
  gsap.set(DATA_ANIMATE_NAME, {
    opacity: 1,
    y: 0,
    scaleX: 1,
    filter: "blur(0px)",
  });
  gsap.set([DATA_ANIMATE_BIO, DATA_ANIMATE_BUTTON, DATA_ANIMATE_CLOCK], {
    opacity: 1,
    y: 0,
  });
  gsap.set(DATA_ANIMATE_FOOTER, { opacity: 1 });
  gsap.set(OPENING_BG, { scale: 1, opacity: 1 });
  gsap.set(OPENING_CURTAIN, { opacity: 0, pointerEvents: "none" });
}

export function OpeningAnimation({ children }: OpeningAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        revealAllStatically();
        return;
      }

      setInitialHiddenStates();

      const tl = gsap.timeline({
        delay: 0.2,
        defaults: { ease: "expo.out" },
        onComplete: () => {
          gsap.set(OPENING_CURTAIN, { pointerEvents: "none" });
        },
      });

      tl.to(OPENING_CURTAIN, {
        opacity: 0,
        duration: 0.9,
        ease: "power2.inOut",
      })
        .to(
          OPENING_BG,
          {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: "power2.out",
          },
          "<0.1"
        )
        .to(
          DATA_ANIMATE_AVATAR,
          {
            opacity: 1,
            scale: 1,
            clipPath: "circle(100% at 50% 50%)",
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .to(
          DATA_ANIMATE_NAME,
          {
            opacity: 1,
            y: 0,
            scaleX: 1,
            filter: "blur(0px)",
            duration: 1,
          },
          "-=0.55"
        )
        .to(
          DATA_ANIMATE_BIO,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.6"
        )
        .to(
          DATA_ANIMATE_BUTTON,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          "-=0.5"
        )
        .to(
          DATA_ANIMATE_CLOCK,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.35"
        )
        .to(
          DATA_ANIMATE_FOOTER,
          {
            opacity: 1,
            duration: 0.5,
          },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <div className="opening-curtain fixed inset-0 z-50 bg-[#0A0A0A]" aria-hidden="true" />
      {children}
    </div>
  );
}
