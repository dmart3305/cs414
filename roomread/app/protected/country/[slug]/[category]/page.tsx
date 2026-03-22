import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const LESSONS = [
  {
    title: "Beginner Guide",
    slug: "beginner",
    description: "Core cultural foundations and essential etiquette.",
    locked: false,
  },
  {
    title: "Intermediate Guide",
    slug: "intermediate",
    description: "Deeper cultural nuance and social expectations.",
    locked: true,
  },
  {
    title: "Advanced Guide",
    slug: "advanced",
    description: "High-context and professional etiquette mastery.",
    locked: true,
  },
];

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; category: string }>;
}) {
  const { slug, category } = await params;

  if (!slug || !category) return notFound();

  // Fetch completed lessons for this category from database
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let completedLessons: string[] = [];

  if (user) {
    const { data } = await supabase
      .from("lesson_progress")
      .select("lesson_slug")
      .eq("user_id", user.id)
      .eq("country_slug", slug)
      .eq("category_slug", category);

    if (data) {
      completedLessons = data.map((p) => p.lesson_slug);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Link
        href={`/protected/country/${slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to country
      </Link>

      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category.replace(/-/g, " ")} Lessons
      </h1>

      <div className="grid gap-4">
        {LESSONS.map((lesson) => {
          const href = `/protected/country/${slug}/${category}/${lesson.slug}`;
          const isCompleted = completedLessons.includes(lesson.slug);

          return lesson.locked ? (
            <div
              key={lesson.slug}
              className="rounded-xl border p-5 bg-muted opacity-60 cursor-not-allowed"
            >
              <h3 className="font-semibold">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          ) : (
            <Link
              key={lesson.slug}
              href={href}
              className={`rounded-xl border p-5 bg-card hover:shadow-sm transition relative ${
                isCompleted ? "border-primary/30" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {lesson.description}
                  </p>
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
