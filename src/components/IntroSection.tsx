import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faBilibili,
  faQq,
} from "@fortawesome/free-brands-svg-icons";
import featuresConfig from "@/config/features.config.json";
import profileConfig from "@/config/profile.config.json";

const ICON_MAP: Record<string, any> = {
  Github: faGithub,
  Bilibili: faBilibili,
  QQ: faQq,
};

export function IntroSection() {
  return (
    <section className="intro-section flex flex-col items-center text-center max-w-[680px] mx-auto px-6">
      <h1 className="font-display text-6xl md:text-5xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
        {profileConfig.name}
      </h1>
      <p className="font-body text-base md:text-sm sm:text-xs text-white/70 leading-relaxed md:leading-relaxed mb-8">
        {profileConfig.bio}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-5">
        {featuresConfig.features.map((feature) => {
          const icon = ICON_MAP[feature.icon];
          return (
            <button
              key={feature.id}
              className="social-button group flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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