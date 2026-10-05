import { Desktop } from "@/components/Desktop";
import { CustomCursor } from "@/components/CustomCursor";
import { WindowProvider, WindowLayer } from "@/components/windows";
import {
  AboutWindow,
  AchievementsSection,
  CTASection,
  Footer,
  PillarStack,
  PortfolioSection,
} from "@/components/sections";

export default function Home() {
  return (
    <WindowProvider>
      {/* overflow-x-hidden would break position:sticky of the desktop — body already clips X */}
      <main className="bg-white">
        <Desktop />
        {/**
         * Continuous white content area. The background is set on the wrapper
         * itself, so every informational section (About, Dřív / Teď /
         * Budoucnost, Skills, Praxe, CTA, Footer) sits on white and the sticky
         * desktop wallpaper can never show through around or between them.
         */}
        <div className="relative z-10 w-full bg-white">
          <AchievementsSection />
          <PillarStack />
          <PortfolioSection />
          <AboutWindow />
          <CTASection />
          <Footer />
        </div>
        <WindowLayer />
      </main>
      <CustomCursor />
    </WindowProvider>
  );
}
