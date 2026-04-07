"use client";

import { useState } from "react";
import { useSound } from "@/lib/use-sound";

export function MatchingGame({
  block,
  onComplete,
}: {
  block: {
    pairs: { name: string; image: string }[];
  };
  onComplete: () => void;
}) {
  const { play } = useSound();

  // Shuffle once (React-safe)
  const [shuffledImages] = useState(() =>
    [...block.pairs].sort(() => Math.random() - 0.5)
  );

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongImage, setWrongImage] = useState<string | null>(null);

  function handleMatch(image: string) {
    if (!selectedName) return;

    const correct = block.pairs.find(
      (p) => p.name === selectedName && p.image === image
    );

    if (correct) {
      play("correct");
      setMatches((prev) => ({ ...prev, [selectedName]: image }));
    } else {
      play("wrong");
      setWrongImage(image);
      setTimeout(() => setWrongImage(null), 500);
    }

    setSelectedName(null);
  }

  const allMatched =
    Object.keys(matches).length === block.pairs.length;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">
        Match the location to the image
      </h3>

      {/* Names */}
      <div className="flex flex-wrap gap-3">
        {block.pairs.map((p) => {
          const isMatched = matches[p.name];

          return (
            <button
              key={p.name}
              disabled={!!isMatched}
              onClick={() => setSelectedName(p.name)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedName === p.name
                  ? "bg-primary text-white"
                  : isMatched
                  ? "bg-green-100 border-green-500 text-green-700 cursor-not-allowed"
                  : "bg-background hover:bg-primary/10"
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {shuffledImages.map((p, i) => {
          const isMatched = Object.values(matches).includes(p.image);
          const isWrong = wrongImage === p.image;

          return (
            <button
              key={i}
              disabled={isMatched}
              onClick={() => handleMatch(p.image)}
              className={`border rounded-lg overflow-hidden transition-all ${
                isMatched
                  ? "opacity-50 border-green-500 cursor-not-allowed"
                  : isWrong
                  ? "border-red-500 animate-pulse"
                  : "hover:scale-105"
              }`}
            >
              <img
                src={p.image}
                alt=""
                className="w-full h-32 object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Continue */}
      {allMatched && (
        <button
          onClick={() => {
            play("click");
            onComplete();
          }}
          className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  );
}