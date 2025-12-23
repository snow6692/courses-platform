import { Suspense } from "react";
import { getUserQuizAttempts } from "@/app/data/quiz/get-user-quiz-attempts";
import { getServerLocale } from "@/lib/i18n";
import EmptyState from "@/components/shared/EmptyState";
import {
  AttemptCard,
  AttemptCardSkeleton,
} from "@/components/attempts/AttemptCard";
import { AttemptsPagination } from "@/components/attempts/AttemptsPagination";
import { History } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AttemptsPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const { t, dir } = await getServerLocale();

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8" dir={dir}>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <History className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            {t("attempts.title")}
          </h1>
          <p className="text-muted-foreground">{t("attempts.subtitle")}</p>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<AttemptsSkeleton />}>
        <AttemptsContent page={page} />
      </Suspense>
    </div>
  );
}

async function AttemptsContent({ page }: { page: number }) {
  const { t } = await getServerLocale();
  const { attempts, pagination } = await getUserQuizAttempts(page);

  if (attempts.length === 0 && page === 1) {
    return (
      <EmptyState
        title={t("attempts.empty_title")}
        description={t("attempts.empty_description")}
        buttonText={t("attempts.browse_courses")}
        href="/courses"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Attempts Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {attempts.map((attempt) => (
          <AttemptCard key={attempt.id} attempt={attempt} />
        ))}
      </div>

      {/* Pagination */}
      <AttemptsPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}

function AttemptsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <AttemptCardSkeleton key={i} />
      ))}
    </div>
  );
}
