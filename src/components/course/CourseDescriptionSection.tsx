import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { getServerLocale } from "@/lib/i18n";

interface CourseDescriptionSectionProps {
  description: string | null;
}

export async function CourseDescriptionSection({
  description,
}: CourseDescriptionSectionProps) {
  const { t, dir } = await getServerLocale();

  if (!description) return null;

  // Try to parse as JSON, if fails treat as plain text
  let parsedDescription;
  try {
    parsedDescription = JSON.parse(description);
  } catch {
    // If not JSON, return null or handle as plain text
    return null;
  }

  return (
    <div className="space-y-4" dir={dir}>
      <div className="prose prose-lg max-w-none text-right text-gray-600">
        <RenderDescription json={parsedDescription} />
      </div>
    </div>
  );
}
