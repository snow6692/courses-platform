"use client";

import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

export function FreeLessonBadge() {
  return (
    <Badge variant="secondary" className="ml-2">
      <Eye className="mr-1 h-3 w-3" />
      Free Preview
    </Badge>
  );
}
