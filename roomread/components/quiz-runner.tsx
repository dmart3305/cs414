"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function QuizRunner({
  countrySlug,
  categorySlug,
}: {
  countrySlug: string;
  categorySlug: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(
          `/api/questions/${countrySlug}/${categorySlug}`
        );
        if (!res.ok) {
          setError("No questions available for this category yet.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setQuestions(data.questions);
      } catch {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [countrySlug, categorySlug]);

  function handleSelect(optionIndex: number) {
    if (showExplanation) return;

    setSelectedOption(optionIndex);
    const correct = optionIndex === questions[currentIndex].correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setShowExplanation(true);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowExplanation(false);
    }
  }

  function handleReturnToCategories() {
    // Build the completed param, adding the current category
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

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="rounded-xl border border-primary/30 bg-card p-8 md:p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Category Complete!
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {"You've answered all " +
            questions.length +
            " questions correctly. Great job learning about these cultural customs!"}
        </p>
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

  const question = questions[currentIndex];

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            {"Question " + (currentIndex + 1) + " of " + questions.length}
          </span>
          <span>
            {Math.round(((currentIndex) / questions.length) * 100) + "% complete"}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${(currentIndex / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <h3 className="text-lg font-semibold text-card-foreground mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => {
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

            // After answering correctly, dim the wrong options
            if (showExplanation && i !== question.correctIndex) {
              optionStyle = "border-border bg-background text-muted-foreground opacity-50";
            }

            // Highlight the correct answer once explanation is shown
            if (showExplanation && i === question.correctIndex) {
              optionStyle =
                "border-primary bg-primary/10 text-primary ring-1 ring-primary/20";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showExplanation}
                className={`flex items-center gap-3 w-full rounded-lg border p-4 text-left text-sm font-medium transition-all ${optionStyle} disabled:cursor-default`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {showExplanation && i === question.correctIndex && (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                )}
                {selectedOption === i && isCorrect === false && (
                  <XCircle className="h-5 w-5 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Wrong answer hint */}
        {isCorrect === false && !showExplanation && (
          <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive font-medium">
              Not quite right. Try again!
            </p>
          </div>
        )}

        {/* Explanation */}
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
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {currentIndex + 1 >= questions.length
                ? "See Results"
                : "Next Question"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
