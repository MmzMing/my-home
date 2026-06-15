import { useRef, useCallback } from "react";
import { useAvatarStore } from "@/store";

const AUDIO_FILES = [
  "/audio/chubby_0.mp3",
  "/audio/chubby_1.mp3",
  "/audio/chubby_2.mp3",
  "/audio/phoeba_chubby_0.mp3",
  "/audio/phoeba_chubby_1.mp3",
  "/audio/phoeba_chubby_2.mp3",
  "/audio/phoeba_chubby_3.mp3",
  "/audio/phoebe_0.mp3",
  "/audio/phoebe_1.mp3",
  "/audio/phoebe_2.mp3",
  "/audio/phoebe_chubby_0.mp3",
  "/audio/phoebe_chubby_1.mp3",
  "/audio/phoebe_chubby_2.mp3",
  "/audio/phoebe_chubby_3.mp3",
  "/audio/phoebe_chubby_4.mp3",
  "/audio/phoebe_chubby_5.mp3",
  "/audio/phoebe_chubby_6.mp3",
  "/audio/phoebe_chubby_7.mp3",
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
