import { useTypingStore } from "@/store";
import { MisideTypingText } from "./MisideTypingText";

export function MisideTypingEffects() {
  const { instances, removeTyping } = useTypingStore();

  if (instances.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none" aria-hidden="true">
      {instances.map((instance) => (
        <MisideTypingText
          key={instance.id}
          id={instance.id}
          text={instance.text}
          x={instance.x}
          y={instance.y}
          font={instance.font}
          onComplete={removeTyping}
        />
      ))}
    </div>
  );
}
