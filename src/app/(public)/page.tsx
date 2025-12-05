import { HeroSection } from "@/components/home/HeroSection";
import { getHeroStats } from "@/actions/stats.action";

export default async function Home() {
  const { usersCount, coursesCount } = await getHeroStats();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection usersCount={usersCount} coursesCount={coursesCount} />
    </main>
  );
}
