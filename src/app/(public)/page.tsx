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
    <main className="relative min-h-screen w-full transition-colors duration-300">
      {/* 3D Spider Web Animation Background */}
      <SpiderWebBackground />

      <FadeIn direction="none">
        <HeroSection usersCount={usersCount} coursesCount={coursesCount} />
      </FadeIn>

      <FadeIn delay={0.2}>
        <Suspense fallback={<BestSellingSectionSkeleton />}>
          <BestSellingSectionWrapper />
        </Suspense>
      </FadeIn>

      <FadeIn delay={0.2}>
        <LearnYourWaySection />
      </FadeIn>

      <FadeIn delay={0.2}>
        <StartJourneySection />
      </FadeIn>

      <FadeIn delay={0.2} direction="up">
        <Footer />
      </FadeIn>
    </main>
  );
}
