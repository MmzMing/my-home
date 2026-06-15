import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faBilibili,
  faQq,
} from "@fortawesome/free-brands-svg-icons";
import featuresConfig from "@/config/features.config.json";

const ICON_MAP: Record<string, any> = {
  Github: faGithub,
  Bilibili: faBilibili,
  QQ: faQq,
};

export function IntroSection() {
  return (
    <section className="intro-section flex flex-col items-center text-center max-w-[680px] mx-auto px-6">
      <h1 className="font-display text-3xl md:text-2xl sm:text-xl text-white mb-4 tracking-tight">
        创意协作 · 信息对齐
      </h1>
      <p className="font-body text-base md:text-sm sm:text-xs text-white/70 leading-relaxed md:leading-relaxed">
        一个聚焦头脑风暴与信息对齐的聚合空间。在这里，灵感交汇，思路对齐，
        让每一次协作都从清晰的认知开始。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {featuresConfig.features.map((feature) => {
          const icon = ICON_MAP[feature.icon];
          return (
            <button
              key={feature.id}
              className="social-button group flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                borderColor: feature.color,
                backgroundColor: "transparent",
              }}
              onClick={() => {
                if (feature.url) {
                  window.open(feature.url, "_blank", "noopener,noreferrer");
                }
              }}
              aria-label={feature.label}
            >
              <FontAwesomeIcon
                icon={icon}
                size="lg"
                className="social-icon transition-all duration-300 group-hover:scale-125 group-hover:rotate-12"
                style={{ color: feature.color }}
              />
              <span
                className="social-text text-sm font-medium transition-all duration-300 group-hover:font-bold"
                style={{ color: feature.color }}
              >
                {feature.label}
              </span>
              <style>{`
                .social-button:hover {
                  background-color: ${feature.color}20;
                  border-width: 2px;
                  box-shadow: 0 0 20px ${feature.color}40;
                }
                .social-icon {
                  transform-origin: center center;
                }
                .social-button:hover .social-icon {
                  filter: drop-shadow(0 0 8px ${feature.color});
                }
                .social-button:hover .social-text {
                  text-shadow: 0 0 10px ${feature.color};
                }
              `}</style>
            </button>
          );
        })}
      </div>
    </section>
  );
}