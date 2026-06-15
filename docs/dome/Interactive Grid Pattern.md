---
title: Interactive Grid Pattern
date: 2024-12-31
description: A interactive background grid pattern made with SVGs, fully customizable using Tailwind CSS.
author: h3rmel
published: true
---

<ComponentPreview name="interactive-grid-pattern-demo" />

## Installation

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add @magicui/interactive-grid-pattern
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

```tsx
"use client"

import React, { useState } from "react"

import { cn } from "@/lib/utils"

/**
 * InteractiveGridPattern is a component that renders a grid pattern with interactive squares.
 *
 * @param width - The width of each square.
 * @param height - The height of each square.
 * @param squares - The number of squares in the grid. The first element is the number of horizontal squares, and the second element is the number of vertical squares.
 * @param className - The class name of the grid.
 * @param squaresClassName - The class name of the squares.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  squares?: [number, number] // [horizontal, vertical]
  className?: string
  squaresClassName?: string
}

/**
 * The InteractiveGridPattern component.
 *
 * @see InteractiveGridPatternProps for the props interface.
 * @returns A React component.
 */
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        "absolute inset-0 h-full w-full border border-gray-400/30",
        className
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width
        const y = Math.floor(index / horizontal) * height
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-gray-400/30 transition-all duration-100 ease-in-out not-[&:hover]:duration-1000",
              hoveredSquare === index ? "fill-gray-300/30" : "fill-transparent",
              squaresClassName
            )}
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        )
      })}
    </svg>
  )
}

```

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</Tabs>

## Examples

### Colorful

<ComponentPreview name="interactive-grid-pattern-demo-2" />

### Usage

```tsx showLineNumbers
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
```

```tsx showLineNumbers
<div className="relative h-[500px] w-full overflow-hidden">
  <InteractiveGridPattern />
</div>
```

## Props

| Prop               | Type               | Default   | Description                                                                                   |
| ------------------ | ------------------ | --------- | --------------------------------------------------------------------------------------------- |
| `width`            | `number`           | `40`      | Width of each square in the grid                                                              |
| `height`           | `number`           | `40`      | Height of each square in the grid                                                             |
| `squares`          | `[number, number]` | `[24,24]` | Number of squares in the grid. First number is horizontal squares, second is vertical squares |
| `className`        | `string`           | `-`       | Class name applied to the grid container                                                      |
| `squaresClassName` | `string`           | `-`       | Class name applied to individual squares in the grid                                          |
