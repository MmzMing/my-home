import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiHome2Line,
  RiBookOpenLine,
  RiFolder2Line,
  RiUserLine,
  RiMailLine,
  RiGithubLine,
  RiImageLine,
  RiBarChartLine,
  RiCircleLine,
} from "react-icons/ri";
import type { IconType } from "react-icons";
import { useMenuStore } from "@/store";
import { cn } from "@/lib/utils";
import menuConfig from "@/config/menu.config.json";
import type { MenuItem } from "@/types";

const ICON_MAP: Record<string, IconType> = {
  Home: RiHome2Line,
  BookOpen: RiBookOpenLine,
  FolderGit2: RiFolder2Line,
  User: RiUserLine,
  Mail: RiMailLine,
  Github: RiGithubLine,
  Image: RiImageLine,
  BarChart: RiBarChartLine,
};

const FIXED_ITEM_COUNT = 8;

function useResponsiveRadius() {
  const [radius, setRadius] = useState(() => {
    if (typeof window === "undefined") return 140;
    return window.innerWidth < 768 ? 100 : window.innerWidth < 1024 ? 120 : 140;
  });

  useEffect(() => {
    const handleResize = () => {
      setRadius(
        window.innerWidth < 768
          ? 100
          : window.innerWidth < 1024
            ? 120
            : 140
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return radius;
}

export function CircularMenu() {
  const { isOpen, position, closeMenu } = useMenuStore();
  const navigate = useNavigate();
  const radius = useResponsiveRadius();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const items = (menuConfig as MenuItem[]).slice(0, FIXED_ITEM_COUNT);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(true);
      const timer = setTimeout(() => setIsClosing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      if (!item.url) return;
      closeMenu();
      if (item.url.startsWith("http")) {
        window.open(item.url, "_blank", "noopener,noreferrer");
      } else {
        navigate(item.url);
      }
    },
    [closeMenu, navigate]
  );

  if (!isOpen && !isClosing) return null;

  const centerX = 0;
  const centerY = 0;
  const innerRadius = 15;
  const outerRadius = radius;
  const sliceAngle = (360 / FIXED_ITEM_COUNT) * (Math.PI / 180);

  const getItemPosition = (index: number) => {
    const angle = (index / FIXED_ITEM_COUNT) * 360 - 90;
    const radian = (angle * Math.PI) / 180;
    const midRadius = (innerRadius + outerRadius) * 0.58;
    const angleOffset = 22.5;
    const adjustedRadian = (angle + angleOffset) * (Math.PI / 180);
    return {
      x: centerX + Math.cos(adjustedRadian) * midRadius,
      y: centerY + Math.sin(adjustedRadian) * midRadius,
      angle: angle,
    };
  };

  const getHoverAreaPath = (index: number) => {
    const startAngle = index * sliceAngle - Math.PI / 2;
    const endAngle = startAngle + sliceAngle;

    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(startAngle);
    const y2 = centerY + outerRadius * Math.sin(startAngle);
    const x3 = centerX + outerRadius * Math.cos(endAngle);
    const y3 = centerY + outerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(endAngle);
    const y4 = centerY + innerRadius * Math.sin(endAngle);

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 touch-none",
          "transition-opacity duration-300",
          isOpen || isClosing ? "opacity-100" : "opacity-0"
        )}
        onClick={closeMenu}
        onTouchEnd={(e) => { e.preventDefault(); closeMenu(); }}
        aria-hidden="true"
      />
      <div
        className="fixed z-50"
        style={{
          left: position.x,
          top: position.y,
        }}
        role="menu"
        aria-label="导航菜单"
      >
        <svg
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            width: outerRadius * 2 + 20,
            height: outerRadius * 2 + 20,
            transform: `translate(-50%, -50%) ${isOpen ? 'scale(1)' : isClosing ? 'scale(0)' : 'scale(0)'}`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <circle
            cx={outerRadius + 10}
            cy={outerRadius + 10}
            r={innerRadius}
            fill="rgba(255,255,255,0.6)"
          />

          {items.map((item, index) => {
            const isEmpty = !item.icon || !item.name;
            if (isEmpty) return null;
            
            const angle = (index / FIXED_ITEM_COUNT) * 2 * Math.PI - Math.PI / 2;
            const endX = outerRadius + 10 + Math.cos(angle) * outerRadius;
            const endY = outerRadius + 10 + Math.sin(angle) * outerRadius;

            return (
              <line
                key={`line-${item.id}`}
                x1={outerRadius + 10}
                y1={outerRadius + 10}
                x2={endX}
                y2={endY}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                className="transition-all duration-300 ease-out"
                style={{
                  animation: isOpen
                    ? `menuLineEnter 0.3s ease-out ${index * 30}ms both`
                    : isClosing
                      ? `menuLineExit 0.2s ease-in ${index * 20}ms both`
                      : undefined,
                }}
              />
            );
          })}

          {items.map((item, index) => {
            const isHovered = hoveredId === item.id;
            const isEmpty = !item.icon || !item.name;
            const path = getHoverAreaPath(index);

            return (
              <path
                key={`area-${item.id}`}
                d={path}
                transform={`translate(${outerRadius + 10}, ${outerRadius + 10})`}
                fill={isHovered ? "rgba(255,255,255,0.08)" : "transparent"}
                stroke="none"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isEmpty) {
                    handleItemClick(item);
                  }
                }}
                onMouseEnter={() => !isEmpty && setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </svg>

        {items.map((item, index) => {
          const { x, y } = getItemPosition(index);
          const Icon = item.icon ? ICON_MAP[item.icon] || RiCircleLine : RiCircleLine;
          const isHovered = hoveredId === item.id;
          const isEmpty = !item.icon || !item.name;

          return (
            <div
              key={item.id}
              className={cn(
                "absolute",
                "flex flex-col items-center justify-center gap-1",
                "transition-all duration-200",
                isEmpty && "opacity-30",
                isHovered && "scale-110"
              )}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                animation: isOpen
                  ? `menuItemEnter 0.3s ease-out ${index * 30 + 50}ms both`
                  : isClosing
                    ? `menuItemExit 0.2s ease-in ${index * 20}ms both`
                    : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isEmpty) {
                  handleItemClick(item);
                }
              }}
              onMouseEnter={() => !isEmpty && setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              role="menuitem"
              tabIndex={isEmpty ? -1 : 0}
              aria-label={item.name || undefined}
            >
              {Icon && (
                <Icon
                  size={isHovered ? 22 : 18}
                  className={cn(
                    "transition-all duration-200",
                    item.id === "github"
                      ? "text-white"
                      : isHovered
                        ? "text-white"
                        : "text-white/70"
                  )}
                />
              )}
              {item.name && (
                <span
                  className={cn(
                    "text-[10px] whitespace-nowrap",
                    "transition-all duration-200",
                    isHovered ? "text-white font-medium" : "text-white/60"
                  )}
                >
                  {item.name}
                </span>
              )}
            </div>
          );
        })}

        <style>{`
          @keyframes menuLineEnter {
            from {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes menuLineExit {
            from {
              stroke-dasharray: 1000;
              stroke-dashoffset: 0;
            }
            to {
              stroke-dashoffset: 1000;
            }
          }
          @keyframes menuItemEnter {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
          }
          @keyframes menuItemExit {
            from {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
            to {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0) rotate(180deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}