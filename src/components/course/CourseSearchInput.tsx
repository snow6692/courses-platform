"use client";

import { Input } from "@/components/ui/input";
import { useLanguage } from "@/providers/LanguageContext";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function CourseSearchInput() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/courses?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative max-w-md">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={t("courses.search_placeholder")}
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
