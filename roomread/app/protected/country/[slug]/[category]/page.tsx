import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { QuizRunner } from "@/components/quiz-runner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORY_MAP: Record<string, string> = {
  "dining-etiquette": "Dining Etiquette",
  "greetings-gestures": "Greetings & Gestures",
  "communication-styles": "Communication Styles",
  "religious-sacred-sites": "Religious & Sacred Sites",
  "dress-codes": "Dress Codes",
  "time-punctuality": "Time & Punctuality",
};

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; category: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { slug, category } = await params;
  const categoryName = CATEGORY_MAP[category];

  if (!categoryName) {
    redirect(`/protected/country/${slug}`);
  }

  const displayName = data.user.user_metadata?.display_name || null;

  // Quiz 
  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader
        userEmail={data.user.email || ""}
        displayName={displayName}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Link
          href={`/protected/country/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {"Back to categories"}
        </Link>

        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2 md:text-3xl text-balance">
          {categoryName}
        </h1>
        <p className="text-muted-foreground mb-8">
          {"Test your knowledge about " +
            categoryName.toLowerCase() +
            " customs."}
        </p>

        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }>
          <QuizRunner countrySlug={slug} categorySlug={category} />
        </Suspense>
      </main>
    </div>
  );
}
