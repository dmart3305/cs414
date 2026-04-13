import { SoundLink } from "@/components/sound-link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Flame, Zap, Trophy } from "lucide-react";
import { BackgroundPattern } from "@/components/background-pattern";
import { createClient } from "@/lib/supabase/server";
import { FadeInUp, PopIn } from "@/components/animations";

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
    <div className="max-w-4xl mx-auto py-10 px-4 bg-gradient-to-b from-background to-muted/30 rounded-xl">
      <BackgroundPattern country={slug} />

      {/* Back Button with sound */}
      <FadeInUp delay={100}>
        <SoundLink
          href={`/protected/country/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to country
        </SoundLink>
      </FadeInUp>

      {/* Title */}
      <PopIn delay={200}>
        <h1 className="text-2xl font-bold mb-2 capitalize">
          {category.replace(/-/g, " ")} Lessons
        </h1>
      </PopIn>

      <FadeInUp delay={300}>
        <p className="text-sm text-muted-foreground mb-6">
          Complete beginner lessons to unlock intermediate content.
        </p>
      </FadeInUp>

      {/* Lesson Cards */}
      <div className="relative z-10 grid gap-4">
        {LESSONS.map((lesson, index) => {
          const href = `/protected/country/${slug}/${category}/${lesson.slug}`;
          const isCompleted = completedLessons.includes(lesson.slug);

          const badgeStyle =
            lesson.slug === "beginner"
              ? "bg-green-500/10 text-green-600"
              : lesson.slug === "intermediate"
              ? "bg-yellow-500/10 text-yellow-600"
              : "bg-red-500/10 text-red-600";

          const icon =
            lesson.slug === "beginner" ? (
              <Flame className="h-4 w-4 text-green-500" />
            ) : lesson.slug === "intermediate" ? (
              <Zap className="h-4 w-4 text-yellow-500" />
            ) : (
              <Trophy className="h-4 w-4 text-red-500" />
            );

          if (lesson.locked) {
            return (
              <FadeInUp key={lesson.slug} delay={400 + index * 100}>
              <div
                className="relative rounded-xl border p-5 bg-muted/50 opacity-70"
              >
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-xs bg-background px-3 py-1 rounded-full border shadow-sm">
                    🔒 Locked
                  </span>
                </div>

                <div className="blur-[1px]">
                  <span
                    className={`inline-block mb-2 text-xs font-semibold px-2 py-1 rounded-full ${badgeStyle}`}
                  >
                    {lesson.slug.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="font-semibold">{lesson.title}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Complete previous lessons to unlock
                  </p>
                </div>
              </div>
              </FadeInUp>
            );
          }

          return (
            <FadeInUp key={lesson.slug} delay={400 + index * 100}>
            <SoundLink
              href={href}
              className={`group relative rounded-xl border p-5 bg-card transition-all duration-300 transform hover:scale-[1.04] hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 ${
                isCompleted ? "border-primary/40 bg-primary/5" : ""
              }`}
            >
              <div className="transition-transform group-hover:translate-x-1">
                <span
                  className={`inline-block mb-2 text-xs font-semibold px-2 py-1 rounded-full ${badgeStyle}`}
                >
                  {lesson.slug.toUpperCase()}
                </span>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {icon}
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {lesson.title}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">
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
              </div>
            </SoundLink>
            </FadeInUp>
          );
        })}
      </div>
    </div>
  );
}
