import { useRef, useCallback } from "react";
import { useAvatarStore } from "@/store";
import audioConfig from "@/config/audio.config.json";

const DEFAULT_VOLUME = audioConfig.volume;
const MAX_CONCURRENCY = audioConfig.maxConcurrency;

export interface PlayResult {
  success: boolean;
  reason?: "concurrency";
}

export function useAudioPlayer() {
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const { playRandomAudio, stopAudio } = useAvatarStore();

  const play = useCallback(
    (trackSrc: string): PlayResult => {
      if (audioRefs.current.length >= MAX_CONCURRENCY) {
        return { success: false, reason: "concurrency" };
      }

      const audio = new Audio(trackSrc);
      audio.volume = DEFAULT_VOLUME;
      audioRefs.current.push(audio);

      const removeAudio = () => {
        const idx = audioRefs.current.indexOf(audio);
        if (idx > -1) audioRefs.current.splice(idx, 1);
      };

      audio.addEventListener("ended", removeAudio);

      audio.play().catch(() => {
        // 浏览器可能阻止自动播放
        removeAudio();
      });
      playRandomAudio(trackSrc);
      return { success: true };
    },
    [playRandomAudio]
  );

  const stopAll = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    audioRefs.current = [];
    stopAudio();
  }, [stopAudio]);

  return { play, stopAll };
}
