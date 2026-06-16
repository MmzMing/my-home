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

export interface TypingFont {
  name: string;
  fallback: string;
}

export interface AudioTypingPair {
  track: string;
  phrase: string;
}

export interface TypingInstance {
  id: string;
  text: string;
  x: number;
  y: number;
  font: TypingFont;
}

export interface TypingState {
  instances: TypingInstance[];
  spawnTyping: (text: string, font: TypingFont) => void;
  removeTyping: (id: string) => void;
}
