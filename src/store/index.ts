import { create } from "zustand";
import type { AvatarState, MenuState } from "@/types";

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
