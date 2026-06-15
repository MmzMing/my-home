import { useState, useRef, useCallback } from "react";
import { useMenuStore } from "@/store";

const LONG_PRESS_DURATION = 500;

export function useCircularMenu() {
  const { isOpen, position, openMenu, closeMenu } = useMenuStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const startPress = useCallback(
    (clientX: number, clientY: number) => {
      setIsPressed(true);
      timerRef.current = setTimeout(() => {
        openMenu(clientX, clientY);
        setIsPressed(false);
      }, LONG_PRESS_DURATION);
    },
    [openMenu]
  );

  const cancelPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressed(false);
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isOpen) {
        openMenu(e.clientX, e.clientY);
      } else {
        closeMenu();
      }
    },
    [isOpen, openMenu, closeMenu]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startPress(touch.clientX, touch.clientY);
    },
    [startPress]
  );

  const handleTouchEnd = useCallback(() => {
    cancelPress();
  }, [cancelPress]);

  return {
    isOpen,
    position,
    isPressed,
    closeMenu,
    handleContextMenu,
    handleTouchStart,
    handleTouchEnd,
  };
}
