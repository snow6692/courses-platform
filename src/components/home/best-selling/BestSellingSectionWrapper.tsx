import { getBestSellingCourses } from "@/app/data/course/get-best-selling-courses";
import { BestSellingSection } from "./BestSellingSection";

export async function BestSellingSectionWrapper() {
  const bestSellingCourses = await getBestSellingCourses();

  return <BestSellingSection courses={bestSellingCourses} />;
}
