import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, visible, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-[100]",
        "px-6 py-3 rounded-xl",
        "bg-black/60 backdrop-blur-md border border-white/10",
        "text-white text-sm font-medium shadow-lg",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      )}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
