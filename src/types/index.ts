export interface MenuItem {
  id: string;
  icon: string;
  name: string;
  url: string;
  order: number;
}

export interface AvatarState {
  isFlipped: boolean;
  isPlaying: boolean;
  currentAudio: string | null;
  flip: () => void;
  playRandomAudio: (src: string) => void;
  stopAudio: () => void;
}

export interface MenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  openMenu: (x: number, y: number) => void;
  closeMenu: () => void;
}
