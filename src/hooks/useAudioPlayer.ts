import { useRef, useCallback } from "react";
import { useAvatarStore } from "@/store";

const AUDIO_FILES = [
  "/audio/sample-1.mp3",
  "/audio/sample-2.mp3",
  "/audio/sample-3.mp3",
];

export function useAudioPlayer() {
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const { playRandomAudio, stopAudio } = useAvatarStore();

  const play = useCallback(() => {
    const randomSrc =
      AUDIO_FILES[Math.floor(Math.random() * AUDIO_FILES.length)];
    const audio = new Audio(randomSrc);
    audio.volume = 0.6;
    audioRefs.current.push(audio);

    audio.addEventListener("ended", () => {
      const idx = audioRefs.current.indexOf(audio);
      if (idx > -1) audioRefs.current.splice(idx, 1);
    });

    audio.play().catch(() => {
      // 浏览器可能阻止自动播放
    });
    playRandomAudio(randomSrc);
  }, [playRandomAudio]);

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
