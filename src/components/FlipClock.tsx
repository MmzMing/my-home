import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface FlipDigitProps {
  digit: string;
}

function FlipDigit({ digit }: FlipDigitProps) {
  const [current, setCurrent] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== current) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setCurrent(digit);
        setIsFlipping(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [digit, current]);

  return (
    <div className="flip-digit relative w-10 h-14 md:w-8 md:h-12 sm:w-7 sm:h-10 bg-white/5 rounded-lg overflow-hidden border border-white/10 shadow-lg shadow-black/50">
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "font-mono text-2xl md:text-xl sm:text-lg font-bold text-white",
            "transition-transform duration-150 ease-in-out",
            isFlipping
              ? "[transform:rotateX(90deg)_scaleY(0.6)] opacity-0"
              : "[transform:rotateX(0deg)_scaleY(1)] opacity-100"
          )}
          style={{ transformOrigin: "bottom center" }}
        >
          {current}
        </span>
      </div>
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
    </div>
  );
}

function FlipSeparator() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 mx-1">
      <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
    </div>
  );
}

export function FlipClock() {
  const { play } = useAudioPlayer();
  const [time, setTime] = useState(() => {
    const now = new Date();
    return {
      hours: String(now.getHours()).padStart(2, "0"),
      minutes: String(now.getMinutes()).padStart(2, "0"),
      seconds: String(now.getSeconds()).padStart(2, "0"),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime({
        hours: String(now.getHours()).padStart(2, "0"),
        minutes: String(now.getMinutes()).padStart(2, "0"),
        seconds: String(now.getSeconds()).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback(() => {
    play();
  }, [play]);

  return (
    <div
      className="flip-clock flex items-center justify-center cursor-pointer select-none"
      role="timer"
      aria-label={`当前时间 ${time.hours}:${time.minutes}:${time.seconds}，点击播放音频`}
      onClick={handleClick}
    >
      <div className="flex gap-0.5">
        <FlipDigit digit={time.hours[0]} />
        <FlipDigit digit={time.hours[1]} />
      </div>
      <FlipSeparator />
      <div className="flex gap-0.5">
        <FlipDigit digit={time.minutes[0]} />
        <FlipDigit digit={time.minutes[1]} />
      </div>
      <FlipSeparator />
      <div className="flex gap-0.5">
        <FlipDigit digit={time.seconds[0]} />
        <FlipDigit digit={time.seconds[1]} />
      </div>
    </div>
  );
}
