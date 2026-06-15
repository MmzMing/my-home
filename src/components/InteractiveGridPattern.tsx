import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps
  extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [32, 32],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width * horizontal} ${height * vertical}`}
      className={cn(
        "absolute",
        className
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-[rgba(255,255,255,0.15)] transition-all duration-100 ease-in-out not-[&:hover]:duration-1000",
              hoveredSquare === index
                ? "fill-[rgba(255,255,255,0.08)]"
                : "fill-transparent",
              squaresClassName
            )}
            strokeWidth="1"
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        );
      })}
    </svg>
  );
}
