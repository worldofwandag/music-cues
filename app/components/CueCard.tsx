import { useRef, useState } from "react";
import { useAudioManager } from "../context/AudioManagerContext";
import { motion } from "framer-motion";

export default function CueCard({ cue }: { cue: any }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { setCurrentAudio } = useAudioManager();

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setCurrentAudio(audioRef.current);
      audioRef.current.play();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 text-white p-4 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-bold">{cue.title}</h3>
      <p className="text-sm text-gray-300">{cue.composer} · {cue.genre}</p>
      <audio src={cue.audio_url} ref={audioRef} onEnded={() => setIsPlaying(false)} />
      <button
        className="mt-2 bg-blue-500 px-3 py-1 rounded"
        onClick={() => {
          togglePlay();
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? "⏸ Pause" : "▶️ Play"}
      </button>
    </motion.div>
  );
}
