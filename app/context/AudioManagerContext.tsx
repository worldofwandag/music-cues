// context/AudioManagerContext.tsx
"use client";
import { createContext, useContext, useRef } from "react";

const AudioManagerContext = createContext({
  currentAudio: null as HTMLAudioElement | null,
  setCurrentAudio: (_audio: HTMLAudioElement | null) => {},
});

export const AudioManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const setCurrentAudio = (audio: HTMLAudioElement | null) => {
    if (currentAudioRef.current && currentAudioRef.current !== audio) {
      currentAudioRef.current.pause();
    }
    currentAudioRef.current = audio;
  };

  return (
    <AudioManagerContext.Provider value={{ currentAudio: currentAudioRef.current, setCurrentAudio }}>
      {children}
    </AudioManagerContext.Provider>
  );
};

export const useAudioManager = () => useContext(AudioManagerContext);
