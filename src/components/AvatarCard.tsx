import { useState, useCallback } from "react";
import { useAvatarStore } from "@/store";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import frontImg from "@/assets/avatar-front.svg";
import backImg from "@/assets/avatar-back.svg";

export function AvatarCard() {
  const { isFlipped, flip } = useAvatarStore();
  const { play } = useAudioPlayer();
  const [isJelly, setIsJelly] = useState(false);

  const handleClick = useCallback(() => {
    setIsJelly(true);
    setTimeout(() => setIsJelly(false), 200);

    if (isFlipped) {
      play();
    } else {
      flip();
    }
  }, [isFlipped, flip, play]);

  const handleFlipBack = useCallback(() => {
    setIsJelly(true);
    setTimeout(() => setIsJelly(false), 200);
    flip();
  }, [flip]);

  return (
    <div className="avatar-container group flex flex-col items-center">
      <div
        className={cn(
          "avatar-flip relative cursor-pointer",
          "w-40 h-40 md:w-32 md:h-32 sm:w-24 sm:h-24",
          isJelly && "avatar-jelly"
        )}
        style={{ perspective: "1000px" }}
        onClick={isFlipped ? handleFlipBack : handleClick}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "点击播放音乐" : "点击翻转头像"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (isFlipped) handleFlipBack();
            else handleClick();
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
            src={frontImg}
            alt="头像正面"
            className="w-full h-full object-cover rounded-full grayscale"
            loading="eager"
          />
        </div>

        {/* 背面 */}
        <div
          className={cn(
            "avatar-face avatar-back absolute inset-0 rounded-full overflow-hidden",
            "transition-transform duration-500 ease-in-out",
            !isFlipped && "[transform:rotateY(-180deg)]"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={backImg}
            alt="头像背面"
            className="w-full h-full object-cover rounded-full grayscale"
            loading="lazy"
          />
        </div>
      </div>

      <span className="mt-4 text-xs text-white/60 tracking-widest uppercase select-none">
        {isFlipped ? "点击播放" : "点击翻转"}
      </span>
    </div>
  );
}
