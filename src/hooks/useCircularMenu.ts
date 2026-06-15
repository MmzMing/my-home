import { useState, useRef, useCallback } from "react";
import { useMenuStore } from "@/store";

const LONG_PRESS_DURATION = 500;
const MOVE_TOLERANCE = 10;

export function useCircularMenu() {
  const { isOpen, position, openMenu, closeMenu } = useMenuStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const startPress = useCallback(
    (clientX: number, clientY: number) => {
      setIsPressed(true);
      startPosRef.current = { x: clientX, y: clientY };
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
    startPosRef.current = null;
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
      if (isOpen) return;
      const touch = e.touches[0];
      startPress(touch.clientX, touch.clientY);
    },
    [isOpen, startPress]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!startPosRef.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startPosRef.current.x;
      const dy = touch.clientY - startPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > MOVE_TOLERANCE) {
        cancelPress();
      }
    },
    [cancelPress]
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
    handleTouchMove,
    handleTouchEnd,
  };
}
