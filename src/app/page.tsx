import { Desktop, FloatingNav } from "@/components/Desktop";
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
      <main className="bg-[#fafafa]">
        <Desktop />
        <FloatingNav />
        <div className="relative z-10">
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
