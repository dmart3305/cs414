import Link from "next/link";
import { notFound } from "next/navigation";

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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category.replace("-", " ")} Lessons
      </h1>

      <div className="grid gap-4">
        {LESSONS.map((lesson) => {
          const href = `/protected/country/${slug}/${category}/${lesson.slug}`;

          return lesson.locked ? (
            <div
              key={lesson.slug}
              className="rounded-xl border p-5 bg-muted opacity-60 cursor-not-allowed"
            >
              <h3 className="font-semibold">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground">
                Coming soon
              </p>
            </div>
          ) : (
            <Link
              key={lesson.slug}
              href={href}
              className="rounded-xl border p-5 bg-card hover:shadow-sm transition"
            >
              <h3 className="font-semibold">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground">
                {lesson.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}