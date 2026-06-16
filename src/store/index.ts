import { create } from "zustand";
import type { AvatarState, MenuState, TypingState } from "@/types";
import audioConfig from "@/config/audio.config.json";

const TYPING = audioConfig.typing;
const PHRASES = TYPING.phrases;
const FONTS = TYPING.fonts;
const MAX_INSTANCES = TYPING.maxInstances;

function randomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPosition() {
  const marginX = window.innerWidth * 0.1;
  const marginY = window.innerHeight * 0.12;
  const x = marginX + Math.random() * (window.innerWidth - marginX * 2);
  const y = marginY + Math.random() * (window.innerHeight - marginY * 2);
  return { x, y };
}

export const useAvatarStore = create<AvatarState>((set) => ({
  isFlipped: false,
  isPlaying: false,
  currentAudio: null,
  flip: () =>
    set((state) => ({
      isFlipped: !state.isFlipped,
    })),
  playRandomAudio: (src: string) =>
    set({
      isPlaying: true,
      currentAudio: src,
    }),
  stopAudio: () =>
    set({
      isPlaying: false,
      currentAudio: null,
    }),
}));

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  position: { x: 0, y: 0 },
  openMenu: (x: number, y: number) =>
    set({
      isOpen: true,
      position: { x, y },
    }),
  closeMenu: () =>
    set({
      isOpen: false,
    }),
}));

export const useTypingStore = create<TypingState>((set) => ({
  instances: [],
  spawnTyping: () =>
    set((state) => {
      const { x, y } = randomPosition();
      const next = [
        ...state.instances,
        {
          id: randomId(),
          text: randomItem(PHRASES),
          x,
          y,
          font: randomItem(FONTS),
        },
      ];
      if (next.length > MAX_INSTANCES) {
        next.shift();
      }
      return { instances: next };
    }),
  removeTyping: (id: string) =>
    set((state) => ({
      instances: state.instances.filter((item) => item.id !== id),
    })),
}));
