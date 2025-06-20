import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: "Expert Instructors",
    description: "Learn from the best instructors in the industry",
    icon: "📕",
  },
  {
    title: "Flexible Learning",
    description: "Learn at your own pace",
    icon: "📕",
  },
  {
    title: "Quality Content",
    description: "Learn from the best instructors in the industry",
    icon: "📕",
  },
  {
    title: "24/7 Support",
    description: "Get help anytime, anywhere",
    icon: "📕",
  },
];
export default function Home() {
  return (
    <>
      <section className="py-20">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Badge variant={"outline"} className="text-lg">
            The feature of Online education
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Learn new skills with our online courses
          </h1>
          <p className="text-muted-foreground max-w-[700px] md:text-xl">
            Discover the best online courses and learn new skills with our
            expert instructors.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={"/courses"} className={buttonVariants({ size: "lg" })}>
              Explore Courses
            </Link>
            <Link
              href={"/dashboard"}
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-32 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader>
              <div className="mb-4 text-4xl"> {feature.icon}</div>
              <CardTitle className="">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
