"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";

/* =========================
   Types
========================= */

type LessonBlock =
  | {
      type: "text";
      text: string;
      image?: {
        src: string;
        alt: string;
      };
    }
  | {
      type: "question";
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };

interface Lesson {
  title: string;
  intro: string;
  content: LessonBlock[];
  summary?: string;
}

/* =========================
   Component
========================= */

export function LessonRunner({
  countrySlug,
  categorySlug,
}: {
  countrySlug: string;
  categorySlug: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  //fetch lesson
  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(
          `/api/questions/${countrySlug}/${categorySlug}`
        );

        if (!res.ok) {
          setError("Lesson not available yet.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setLesson(data.lesson);
      } catch {
        setError("Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [countrySlug, categorySlug]);

  function handleNext() {
    if (!lesson) return;

    if (currentIndex + 1 >= lesson.content.length) {
      setCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowExplanation(false);
    }
  }

  function handleSelect(optionIndex: number) {
    if (!lesson) return;

    const block = lesson.content[currentIndex];
    if (block.type !== "question") return;
    if (showExplanation) return;

    setSelectedOption(optionIndex);

    const correct = optionIndex === block.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setShowExplanation(true);
    }
  }

  function handleReturnToCategories() {
    const existingCompleted = searchParams.get("completed") || "";
    const completedSet = new Set(
      existingCompleted ? existingCompleted.split(",") : []
    );
    completedSet.add(categorySlug);
    const completedParam = Array.from(completedSet).join(",");

    router.push(
      `/protected/country/${countrySlug}?completed=${completedParam}`
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          {error || "Lesson unavailable."}
        </p>
      </div>
    );
  }

//completion screen
  if (completed) {
    return (
      <div className="rounded-xl border border-primary/30 bg-card p-8 md:p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Trophy className="h-8 w-8 text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Lesson Complete!
        </h2>

        {lesson.summary && (
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {lesson.summary}
          </p>
        )}

        <button
          onClick={handleReturnToCategories}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Return to Categories
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const block = lesson.content[currentIndex];

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            Step {currentIndex + 1} of {lesson.content.length}
          </span>
          <span>
            {Math.round(
              (currentIndex / lesson.content.length) * 100
            ) + "% complete"}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${(currentIndex / lesson.content.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* ================= TEXT BLOCK ================= */}
      {block.type === "text" && (
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          {block.image && (
            <img
              src={block.image.src}
              alt={block.image.alt}
              className="w-full h-48 object-cover rounded-md mb-6"
            />
          )}

          <p className="text-foreground leading-relaxed mb-6">
            {block.text}
          </p>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ================= QUESTION BLOCK ================= */}
      {block.type === "question" && (
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-6 leading-relaxed">
            {block.question}
          </h3>

          <div className="flex flex-col gap-3">
            {block.options.map((option, i) => {
              let optionStyle =
                "border-border bg-background hover:border-primary/30 hover:bg-primary/5 text-foreground";

              if (selectedOption === i) {
                if (isCorrect) {
                  optionStyle =
                    "border-primary bg-primary/10 text-primary ring-1 ring-primary/20";
                } else {
                  optionStyle =
                    "border-destructive bg-destructive/10 text-destructive ring-1 ring-destructive/20";
                }
              }

              if (showExplanation && i !== block.correctIndex) {
                optionStyle =
                  "border-border bg-background text-muted-foreground opacity-50";
              }

              if (showExplanation && i === block.correctIndex) {
                optionStyle =
                  "border-primary bg-primary/10 text-primary ring-1 ring-primary/20";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showExplanation}
                  className={`flex items-center gap-3 w-full rounded-lg border p-4 text-left text-sm font-medium transition-all ${optionStyle}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>

                  <span className="flex-1">{option}</span>

                  {showExplanation && i === block.correctIndex && (
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                  )}

                  {selectedOption === i && isCorrect === false && (
                    <XCircle className="h-5 w-5 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {isCorrect === false && !showExplanation && (
            <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-sm text-destructive font-medium">
                Not quite right. Try again!
              </p>
            </div>
          )}

          {showExplanation && (
            <div className="mt-6">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">
                      Correct!
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {block.explanation}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {currentIndex + 1 >= lesson.content.length
                  ? "Finish Lesson"
                  : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}