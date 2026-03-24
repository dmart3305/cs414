"use client";

import { useState, useEffect } from "react";

export function ImageSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-xl mb-6">
      
      {/* Images */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`slide-${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* DOT INDICATORS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}