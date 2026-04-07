"use client";

import { useRef } from "react";

type SoundType = "click" | "correct" | "wrong";

export function useSound() {
  const sounds = useRef<Record<SoundType, HTMLAudioElement>>({
    click: new Audio("/sound effects/click.mp3"),
    correct: new Audio("/sound effects/correct.mp3"),
    wrong: new Audio("/sound effects/incorrect.mp3"),
  });

  function play(type: SoundType) {
    const sound = sounds.current[type];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play();
  }

  return { play };
}