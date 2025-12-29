import { HeroSection } from "@/components/home/HeroSection";
import { getHeroStats } from "@/actions/stats.action";
import { Suspense } from "react";

import { LearnYourWaySection } from "@/components/home/LearnYourWaySection";
import { BestSellingSectionSkeleton } from "@/components/home/best-selling/BestSellingSectionSkeleton";
import { BestSellingSectionWrapper } from "@/components/home/best-selling/BestSellingSectionWrapper";
import { StartJourneySection } from "@/components/home/StartJourneySection";
import { Footer } from "@/components/shared/Footer";

import { FadeIn } from "@/components/animations/FadeIn";
import { SpiderWebBackground } from "@/components/animations/SpiderWebBackground";

export const revalidate = 300;

export default async function Home() {
  const { usersCount, coursesCount } = await getHeroStats();

  return (
    <main className="relative min-h-screen w-full">
      {/* 3D Spider Web Animation - Fixed background */}
      <SpiderWebBackground />

      {/* Hero Section */}
      <FadeIn direction="none" className="mb-12">
        <HeroSection usersCount={usersCount} coursesCount={coursesCount} />
      </FadeIn>

      {/* Content sections - full width with gaps between them */}
      <div className="relative z-10 space-y-12">
        {/* Best Selling Section */}
        <div className="bg-background">
          <FadeIn delay={0.2}>
            <Suspense fallback={<BestSellingSectionSkeleton />}>
              <BestSellingSectionWrapper />
            </Suspense>
          </FadeIn>
        </div>

        {/* Learn Your Way Section */}
        <div className="bg-background">
          <FadeIn delay={0.2}>
            <LearnYourWaySection />
          </FadeIn>
        </div>

        {/* Start Journey Section */}
        <div className="bg-background">
          <FadeIn delay={0.2}>
            <StartJourneySection />
          </FadeIn>
        </div>

        {/* Footer */}
        <div className="bg-background">
          <FadeIn delay={0.2} direction="up">
            <Footer />
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
