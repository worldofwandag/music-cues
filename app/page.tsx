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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  useEffect(() => {
    const fetchCues = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        
        const res = await fetch("/api/cues");
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${res.status}`
          );
        }
        
        const data = await res.json();
        
        // Ensures data is an array
        if (Array.isArray(data)) {
          setCues(data);
        } else {
          console.error("API returned non-array data:", data);
          setCues([]);
          setError("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Failed to fetch cues:", err);
        setError(err instanceof Error ? err.message : "Failed to load music cues");
        setCues([]); // Ensures cues remains an array
      } finally {
        setLoading(false);
      }
    };

    fetchCues();
  }, []);

 
  const retryFetch = () => {
    setLoading(true);
    setError(null);
    
    const fetchCues = async () => {
      try {
        const res = await fetch("/api/cues");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setCues(data);
        } else {
          console.error("API returned non-array data:", data);
          setCues([]);
          setError("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Failed to fetch cues:", err);
        setError(err instanceof Error ? err.message : "Failed to load music cues");
        setCues([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCues();
  };

  // Show loading state
  if (loading) {
    return (
      <main className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Loading music cues...</p>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 max-w-md text-center">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            onClick={retryFetch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // splitting comma-separated values
  const genres = [...new Set(
    cues
      .flatMap((c) => {
        // Safety check: ensure genre exists and is a string
        if (!c.genre || typeof c.genre !== 'string') {
          return [];
        }
        
        return c.genre
          .split(',')
          .map(genre => genre.trim().toLowerCase())
          .filter(Boolean);
      })
  )].sort(); 

  
  const filtered = cues.filter((cue) => {
    const matchesSearch = cue.title.toLowerCase().includes(search.toLowerCase());
    
    if (genreFilter === "") return matchesSearch;
    
    // Safety check for genre field
    if (!cue.genre || typeof cue.genre !== 'string') {
      return false;
    }
    
    const cueGenres = cue.genre
      .split(',')
      .map(genre => genre.trim().toLowerCase());
    
    const matchesGenre = cueGenres.includes(genreFilter.toLowerCase());
    
    return matchesSearch && matchesGenre;
  });

  return (
    <main className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">Music Cue Browser</h1>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by title..."
          />
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="p-3 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)} {/* Capitalize first letter */}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filtered.length} of {cues.length} cues
        </div>

        {/* Cues Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {cues.length === 0 
                ? "No music cues available." 
                : "No cues match your search criteria."
              }
            </p>
            {search || genreFilter ? (
              <button
                onClick={() => {
                  setSearch("");
                  setGenreFilter("");
                }}
                className="mt-4 text-blue-500 hover:text-blue-700 underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((cue) => (
                <CueCard key={cue.id} cue={cue} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}