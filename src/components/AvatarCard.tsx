import { useState, useCallback, useRef, useEffect } from "react";
import { useAvatarStore, useTypingStore } from "@/store";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import { Toast } from "@/components/Toast";
import profileConfig from "@/config/profile.config.json";
import audioConfig from "@/config/audio.config.json";
import type { TypingFont } from "@/types";

const { maxClicks: MAX_CLICKS_PER_MINUTE, windowMs: CLICK_WINDOW_MS } =
  audioConfig.clickRateLimit;
const TYPING_PAIRS = audioConfig.typing.pairs;
const TYPING_FONTS = audioConfig.typing.fonts;

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function AvatarCard() {
  const { isFlipped, flip } = useAvatarStore();
  const { play } = useAudioPlayer();
  const { spawnTyping } = useTypingStore();
  const [isJelly, setIsJelly] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const clickTimestampsRef = useRef<number[]>([]);
  const jellyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (jellyTimerRef.current) {
        clearTimeout(jellyTimerRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  const handleClick = useCallback(() => {
    if (isFlipped) {
      const now = Date.now();
      clickTimestampsRef.current = clickTimestampsRef.current.filter(
        (ts) => now - ts < CLICK_WINDOW_MS
      );
      if (clickTimestampsRef.current.length >= MAX_CLICKS_PER_MINUTE) {
        showToast("点击太频繁啦，休息一下吧");
        return;
      }
      clickTimestampsRef.current.push(now);
    }

    setIsJelly(true);
    if (jellyTimerRef.current) {
      clearTimeout(jellyTimerRef.current);
    }
    jellyTimerRef.current = setTimeout(() => setIsJelly(false), 200);

    if (isFlipped) {
      const pair = randomItem(TYPING_PAIRS);
      const font: TypingFont = randomItem(TYPING_FONTS);
      const result = play(pair.track);
      if (!result.success && result.reason === "concurrency") {
        showToast("同时播放的音频太多啦，稍后再试");
      }
      spawnTyping(pair.phrase, font);
    } else {
      flip();
    }
  }, [isFlipped, flip, play, showToast, spawnTyping]);

  return (
    <>
      <Toast message={toastMessage} visible={toastVisible} onClose={hideToast} />
      <div className="avatar-container group flex flex-col items-center" data-animate="avatar">
        <div
          className={cn(
            "avatar-flip relative cursor-pointer",
            "w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80",
            isJelly && "avatar-jelly"
          )}
          style={{ perspective: "1000px" }}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          title={isFlipped ? "点击播放" : "点击翻转"}
          aria-label={isFlipped ? "点击播放音乐" : "点击翻转头像"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {/* 正面 */}
          <div
            className={cn(
              "avatar-face avatar-front absolute inset-0 rounded-full overflow-hidden",
              "border-2 border-white/80",
              "shadow-[0_0_20px_rgba(255,255,255,0.3),0_0_40px_rgba(255,255,255,0.1)]",
              "transition-transform duration-500 ease-in-out",
              isFlipped && "[transform:rotateY(180deg)]"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={profileConfig.avatar.front}
              alt="头像正面"
              className="w-full h-full object-cover rounded-full"
              loading="eager"
              draggable={false}
            />
          </div>

          {/* 背面 */}
          <div
            className={cn(
              "avatar-face avatar-back absolute inset-0 flex items-center justify-center rounded-full overflow-hidden",
              "transition-transform duration-500 ease-in-out",
              !isFlipped && "[transform:rotateY(-180deg)]"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={profileConfig.avatar.back}
              alt="头像背面"
              className="w-full h-full object-contain p-4"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
