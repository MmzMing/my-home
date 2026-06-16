import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import audioConfig from "@/config/audio.config.json";
import type { TypingFont } from "@/types";

const {
  charDelayMs: CHAR_DELAY_MS,
  displayDurationMs: DISPLAY_DURATION_MS,
  fallStaggerMs: FALL_STAGGER_MS,
} = audioConfig.typing;

interface MisideTypingTextProps {
  id: string;
  text: string;
  x: number;
  y: number;
  font: TypingFont;
  onComplete: (id: string) => void;
}

export function MisideTypingText({
  id,
  text,
  x,
  y,
  font,
  onComplete,
}: MisideTypingTextProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "falling" | "done">("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chars = Array.from(text);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;

    if (visibleCount >= chars.length) {
      timerRef.current = setTimeout(() => {
        setPhase("falling");
      }, DISPLAY_DURATION_MS);
      return;
    }

    timerRef.current = setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, CHAR_DELAY_MS);

    return clearTimer;
  }, [phase, visibleCount, chars.length, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const handleLastAnimationEnd = useCallback(() => {
    if (phase === "falling") {
      setPhase("done");
      onComplete(id);
    }
  }, [phase, id, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed z-[85] pointer-events-none",
        "flex flex-wrap justify-center items-center",
        "text-4xl md:text-5xl lg:text-6xl"
      )}
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        fontFamily: `"${font.name}", ${font.fallback}`,
        textShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}
      aria-hidden="true"
    >
      {chars.map((char, index) => {
        if (index >= visibleCount) return null;
        const isLast = index === chars.length - 1;
        const randomAngle = Math.floor(Math.random() * 60) - 30;

        return (
          <span
            key={index}
            className={cn(
              "inline-block text-white whitespace-pre",
              phase === "typing" && "miside-bounce-in",
              phase === "falling" && "miside-jump-and-fall"
            )}
            style={{
              "--random-angle": randomAngle,
              animationDelay:
                phase === "falling" ? `${index * (FALL_STAGGER_MS / 1000)}s` : undefined,
            } as React.CSSProperties}
            onAnimationEnd={isLast ? handleLastAnimationEnd : undefined}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
