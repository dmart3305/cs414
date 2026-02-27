import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { LessonRunner } from "@/components/lesson-runner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORY_MAP: Record<string, string> = {
  "dining-etiquette": "Dining Etiquette",
  "greetings-gestures": "Greetings & Gestures",
  "religious-sacred-sites": "Religious & Sacred Sites",
  "dress-codes": "Dress Codes",
  "time-punctuality": "Time & Punctuality",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; category: string; lesson: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { slug, category, lesson } = await params;
  const categoryName = CATEGORY_MAP[category];

  if (!categoryName) {
    redirect(`/protected/country/${slug}`);
  }

  // Only beginner exists for now
  if (lesson !== "beginner") {
    redirect(`/protected/country/${slug}/${category}`);
  }

  const displayName = data.user.user_metadata?.display_name || null;

  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader
        userEmail={data.user.email || ""}
        displayName={displayName}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Link
          href={`/protected/country/${slug}/${category}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to lessons
        </Link>

        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2 md:text-3xl text-balance">
          {categoryName} — Beginner
        </h1>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          }
        >
          <LessonRunner
            countrySlug={slug}
            categorySlug={category}
            lessonSlug={lesson}
          />
        </Suspense>
      </main>
    </div>
  );
}