import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/InteractiveGridPattern";
import { AvatarCard } from "@/components/AvatarCard";
import { IntroSection } from "@/components/IntroSection";
import { FlipClock } from "@/components/FlipClock";
import { CircularMenu } from "@/components/CircularMenu";
import { MisideTypingEffects } from "@/components/MisideTypingEffects";
import { OpeningAnimation } from "@/components/OpeningAnimation";
import { useCircularMenu } from "@/hooks/useCircularMenu";

export default function Home() {
  const {
    handleContextMenu,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCircularMenu();

  return (
    <div
      className="relative min-h-screen overflow-hidden touch-manipulation"
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <OpeningAnimation>
        {/* 斜网格背景 - 参考 magicui 样式 */}
        <div className="opening-bg fixed inset-0 pointer-events-auto overflow-hidden z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] skew-y-6 md:skew-y-12">
            <InteractiveGridPattern
              width={40}
              height={40}
              squares={[40, 40]}
              className={cn(
                "w-full h-full",
                "[mask-image:radial-gradient(min(80vw,600px)_circle_at_center,white,transparent)]"
              )}
            />
          </div>
        </div>

        {/* 前景内容 - 垂直流式居中 */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-12 md:gap-10 sm:gap-8 px-4 pointer-events-none">
          {/* 第一层：头像展示区 */}
          <div className="pointer-events-auto">
            <AvatarCard />
          </div>

          {/* 第二层：个人/项目介绍层 */}
          <div className="pointer-events-auto">
            <IntroSection />
          </div>

          {/* 第三层：翻页数字时钟 */}
          <div className="pointer-events-auto">
            <FlipClock />
          </div>
        </main>

        {/* 底部版权 */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/30 text-xs tracking-wider select-none pointer-events-none"
          data-animate="footer"
        >
          <span>© 2026 MmzMing 粤ICP备2026073665号-1</span>
        </div>
      </OpeningAnimation>

      {/* 米塔打字机效果 */}
      <MisideTypingEffects />

      {/* 右键圆形菜单 */}
      <CircularMenu />
    </div>
  );
}
