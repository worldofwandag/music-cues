import { useRef, useState } from "react";
import { useAudioManager } from "../context/AudioManagerContext";
import { motion } from "framer-motion";

export default function CueCard({ cue }: { cue: any }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const { setCurrentAudio } = useAudioManager();

  const togglePlay = async () => {
    if (!audioRef.current || !cue.audio_url || audioError) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setCurrentAudio(audioRef.current);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio play error:", error);
      setAudioError(true);
    }
  };

  const restartAudio = async () => {
    if (!audioRef.current || !cue.audio_url || audioError) return;
    
    try {
      audioRef.current.currentTime = 0; // Reset to beginning
      setCurrentAudio(audioRef.current);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio restart error:", error);
      setAudioError(true);
    }
  };

  const handleAudioError = () => {
    console.error("Audio load error for:", cue.audio_url);
    setAudioError(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 text-white p-4 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-bold">{cue.title}</h3>
      <p className="text-sm text-gray-300"><b>Composer: </b>{cue.composer}</p>
      <p className="text-sm text-gray-300"><i>{cue.genre}</i></p>
      
      
      {cue.audio_url && !audioError && (
        <audio 
          src={cue.audio_url} 
          ref={audioRef} 
          onEnded={() => setIsPlaying(false)}
          onError={handleAudioError}
          onCanPlay={() => setAudioError(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
      
      {/* Audio Controls */}
      <div className="flex gap-2 mt-2">
        <button
          className={`px-3 py-1 rounded transition-colors ${
            !cue.audio_url || audioError
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
              : isPlaying
                ? "bg-slate-600 hover:bg-slate-500 text-gray-200"
                : "bg-slate-700 hover:bg-slate-600 text-gray-200"
          }`}
          onClick={togglePlay}
          disabled={!cue.audio_url || audioError}
        >
          {!cue.audio_url 
            ? "🚫 No Audio" 
            : audioError
              ? "❌ Audio Error"
              : isPlaying 
                ? "⏸ Pause" 
                : "▶️ Play"
          }
        </button>

        
        {cue.audio_url && !audioError && (
          <button
            className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-gray-200 transition-colors"
            onClick={restartAudio}
            title="Restart from beginning"
          >
            🔄 Restart
          </button>
        )}
      </div>
      
      
      
    </motion.div>
  );
}