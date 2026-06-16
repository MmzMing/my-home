import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faBilibili,
  faQq,
} from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import featuresConfig from "@/config/features.config.json";
import profileConfig from "@/config/profile.config.json";
import "@/styles/intro-section.css";

const ICON_MAP: Record<string, IconDefinition> = {
  Github: faGithub,
  Bilibili: faBilibili,
  QQ: faQq,
};

export function IntroSection() {
  return (
    <section className="intro-section flex flex-col items-center text-center max-w-[680px] mx-auto px-6">
      <h1
        className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
        data-animate="name"
      >
        {profileConfig.name}
      </h1>
      <p
        className="font-body text-xs sm:text-sm md:text-base text-white/70 leading-relaxed md:leading-relaxed mb-8"
        data-animate="bio"
      >
        {profileConfig.bio}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-5">
        {featuresConfig.features.map((feature) => {
          const icon = ICON_MAP[feature.icon];
          return (
            <button
              key={feature.id}
              className="social-button group flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={
                {
                  borderColor: feature.color,
                  "--feature-color": feature.color,
                } as React.CSSProperties
              }
              onClick={() => {
                if (feature.url) {
                  window.open(feature.url, "_blank", "noopener,noreferrer");
                }
              }}
              aria-label={feature.label}
              data-animate="button"
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
            </button>
          );
        })}
      </div>
      {featuresConfig.menuHint && (
        <p className="mt-6 text-white/30 text-xs tracking-wider select-none">
          {featuresConfig.menuHint}
        </p>
      )}
    </section>
  );
}
