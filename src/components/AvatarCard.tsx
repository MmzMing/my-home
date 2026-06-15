import { useState, useCallback } from "react";
import { useAvatarStore } from "@/store";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import profileConfig from "@/config/profile.config.json";

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

  return (
    <div className="avatar-container group flex flex-col items-center">
      <div
        className={cn(
          "avatar-flip relative cursor-pointer",
          "w-80 h-80 md:w-64 md:h-64 sm:w-48 sm:h-48",
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
          />
        </div>

        {/* 背面 */}
        <div
          className={cn(
            "avatar-face avatar-back absolute -inset-10",
            "transition-transform duration-500 ease-in-out",
            !isFlipped && "[transform:rotateY(-180deg)]"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={profileConfig.avatar.back}
            alt="头像背面"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
