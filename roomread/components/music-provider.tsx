"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const MusicContext = createContext({
  muted: false,
  toggleMute: () => {},
});

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music/backgroundloopbossa.wav");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // try autoplay (will work after first interaction)
    audio.play().catch(() => {});

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = muted;

    if (!muted) {
      audioRef.current.play().catch(() => {});
    }
  }, [muted]);

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <MusicContext.Provider value={{ muted, toggleMute }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}