import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Separator } from "@/components/ui/separator";
import { getServerLocale } from "@/lib/i18n";

interface CourseDescriptionSectionProps {
  description: string;
}

export async function CourseDescriptionSection({
  description,
}: CourseDescriptionSectionProps) {
  const { t } = await getServerLocale();

  return (
    <div className="space-y-6">
      <Separator className="my-8" />
      <h2 className="text-3xl font-semibold tracking-tight">
        {t("course_detail.course_description")}
      </h2>
      <RenderDescription json={JSON.parse(description)} />
    </div>
  );
}
