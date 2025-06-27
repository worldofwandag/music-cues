
"use client";
import { useEffect, useState } from "react";
import CueCard from "../app/components/CueCard";
import { AnimatePresence } from "framer-motion";

type Cue = {
  id: string | number;
  title: string;
  composer: string;
  genre: string;
  audio_url: string;
};

export default function Home() {
  const [cues, setCues] = useState<Cue[]>([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  useEffect(() => {
    fetch("/api/cues")
      .then((res) => res.json())
      .then((data) => setCues(data));
  }, []);

  const genres = [...new Set(cues.map((c) => c.genre))];

  const filtered = cues.filter((cue) =>
    cue.title.toLowerCase().includes(search.toLowerCase()) &&
    (genreFilter === "" || cue.genre === genreFilter)
  );

  return (
    <main className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 text-black rounded"
          placeholder="Search by title..."
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="p-2 text-black rounded"
        >
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((cue) => (
            <CueCard key={cue.id} cue={cue} />
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
