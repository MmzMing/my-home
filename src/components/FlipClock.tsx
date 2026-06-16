import { useState, useEffect, useRef } from "react";
import "@/styles/flip-clock.css";

/**
 * Classic flip-card clock, faithful to the docs/demo/demo-clock prototype.
 *
 * Each digit card is split into a static top half and bottom half (both showing
 * the current digit). On change, two extra folding layers animate:
 *   - foldTop:    old digit's top half, rotates 0° -> -90° (folds away)
 *   - foldBottom: new digit's bottom half, rotates 90° -> 0° (drops in)
 * Animation CSS lives in src/styles/flip-clock.css (.flip-card / .flip-half / @keyframes).
 */
function FlipDigit({ digit }: { digit: string }) {
  const [current, setCurrent] = useState(digit);
  const [previous, setPrevious] = useState(digit);
  const [flipping, setFlipping] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (digit !== current) {
      setPrevious(current);
      setCurrent(digit);
      setFlipping(true);
      if (timer.current) window.clearTimeout(timer.current);
      // 0.35s fold-down + 0.35s fold-up = 0.7s total
      timer.current = window.setTimeout(() => setFlipping(false), 700);
    }
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digit]);

  const renderHalf = (
    which: "top" | "bottom",
    value: string,
    extraClass = ""
  ) => (
    <div className={`flip-half flip-half-${which} ${extraClass}`}>
      <div className={`flip-inner flip-inner-${which}`}>{value}</div>
    </div>
  );

  return (
    <div className={`flip-card ${flipping ? "play" : ""}`}>
      {/* static top reveals the NEW digit once foldTop(old) rotates away */}
      {renderHalf("top", current)}
      {/* static bottom keeps the OLD digit until foldBottom(new) drops in */}
      {renderHalf("bottom", flipping ? previous : current)}

      {/* folding layers, only meaningful while flipping */}
      {flipping && renderHalf("top", previous, "flip-fold-top")}
      {flipping && renderHalf("bottom", current, "flip-fold-bottom")}
    </div>
  );
}

function FlipSeparator() {
  return (
    <div className="flip-separator" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}

export function FlipClock() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return {
      hours: String(now.getHours()).padStart(2, "0"),
      minutes: String(now.getMinutes()).padStart(2, "0"),
      seconds: String(now.getSeconds()).padStart(2, "0"),
    };
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date();
      setTime({
        hours: String(now.getHours()).padStart(2, "0"),
        minutes: String(now.getMinutes()).padStart(2, "0"),
        seconds: String(now.getSeconds()).padStart(2, "0"),
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className="flip-clock select-none"
      data-animate="clock"
      role="timer"
      aria-label={`当前时间 ${time.hours}:${time.minutes}:${time.seconds}`}
    >
      <div className="flip-group">
        <FlipDigit digit={time.hours[0]} />
        <FlipDigit digit={time.hours[1]} />
      </div>
      <FlipSeparator />
      <div className="flip-group">
        <FlipDigit digit={time.minutes[0]} />
        <FlipDigit digit={time.minutes[1]} />
      </div>
      <FlipSeparator />
      <div className="flip-group">
        <FlipDigit digit={time.seconds[0]} />
        <FlipDigit digit={time.seconds[1]} />
      </div>
    </div>
  );
}
