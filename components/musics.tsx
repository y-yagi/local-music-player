import MusicDatase from "../lib/music_database";
import Player from "./player";
import Uploader from "./uploader";
import SectionSeparotr from "./section-separator";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MusicType from "../types/music";

const BOOKMARK_STORAGE_KEY = "local-music-player-bookmark";

type Bookmark = {
  musicId: number;
  title: string;
  time: number;
};

const Musics = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [musics, setMusics] = useState<MusicType[] | undefined>(undefined);
  const [currentMusicId, setCurrentMusicId] = useState<number | null>(null);
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const handleSeekApplied = useCallback(() => {
    setSeekTime(null);
  }, []);
  const router = useRouter();
  const { sort } = router.query;
  const sortParam = Array.isArray(sort) ? sort[0] : sort;
  const isLoading = musics === undefined;

  async function fetchData() {
    const db = new MusicDatase();
    try {
      const musics = await db.musics.orderBy("id").toArray();
      if (sortParam === "title") {
        musics.sort(function (a, b) {
          if (
            a.name === undefined ||
            b.name === undefined ||
            a.name === b.name
          ) {
            return 0;
          }
          return a.name > b.name ? 1 : -1;
        });
      }

      setMusics(musics);
    } catch (e) {
      console.error(e);
    }
  }

  function playMusic(music: MusicType) {
    const url = URL.createObjectURL(music.file);
    const resolvedTitle = music.name?.trim() ?? "Untitled track";
    setTitle(resolvedTitle);
    setUrl(url);
    setCurrentMusicId(music.id ?? null);
    setSeekTime(null);
  }

  function handleClick(music: MusicType) {
    playMusic(music);
  }

  function handleUpload() {
    fetchData();
  }

  async function handleDestroy(id: number | undefined) {
    if (id === undefined) {
      return;
    }

    const db = new MusicDatase();
    await db.musics.where("id").anyOf(id).delete();
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, [sortParam]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const audio = document.querySelector("audio");
    if (!audio) {
      setIsPlaying(false);
      return;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePauseOrEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePauseOrEnded);
    audio.addEventListener("ended", handlePauseOrEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePauseOrEnded);
      audio.removeEventListener("ended", handlePauseOrEnded);
    };
  }, [url]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedBookmark = window.localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (!savedBookmark) {
      return;
    }

    try {
      const parsed = JSON.parse(savedBookmark) as Bookmark;
      setBookmark(parsed);
    } catch (error) {
      console.error("Failed to parse bookmark", error);
      window.localStorage.removeItem(BOOKMARK_STORAGE_KEY);
    }
  }, []);

  function handleBookmarkSave() {
    if (typeof window === "undefined") {
      return;
    }

    if (currentMusicId === null || title === "") {
      return;
    }

    const audio = document.querySelector("audio");
    if (!audio) {
      return;
    }

    const bookmarkData: Bookmark = {
      musicId: currentMusicId,
      title,
      time: audio.currentTime,
    };

    window.localStorage.setItem(
      BOOKMARK_STORAGE_KEY,
      JSON.stringify(bookmarkData),
    );
    setBookmark(bookmarkData);
  }

  function clearBookmark() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(BOOKMARK_STORAGE_KEY);
    }
    setBookmark(null);
  }

  async function handleBookmarkPlay() {
    if (!bookmark) {
      return;
    }

    const db = new MusicDatase();
    const music = await db.musics.where("id").anyOf(bookmark.musicId).first();
    if (!music) {
      clearBookmark();
      return;
    }

    playMusic(music);
    setSeekTime(bookmark.time);
    clearBookmark();
  }

  function formatBookmarkLabel(entry: Bookmark) {
    const minutes = Math.floor(entry.time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(entry.time % 60)
      .toString()
      .padStart(2, "0");
    return `${entry.title || "Saved track"} (${minutes}:${seconds})`;
  }

  return (
    <div>
      <Player
        url={url}
        title={title}
        seekTime={seekTime}
        onSeekApplied={handleSeekApplied}
      />
      <div
        className="flex flex-col gap-3 my-4 sm:flex-row"
        aria-label="Bookmark controls"
      >
        {isPlaying && (
          <button
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-full w-full sm:w-auto"
            type="button"
            onClick={handleBookmarkSave}
            disabled={currentMusicId === null}
          >
            Remember current spot
          </button>
        )}
        {bookmark && (
          <button
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-full w-full sm:w-auto"
            type="button"
            onClick={handleBookmarkPlay}
          >
            Play saved spot: {formatBookmarkLabel(bookmark)}
          </button>
        )}
      </div>
      <hr />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-gray-700">Sort:</span>
        <Link
          href="/"
          className={`rounded-full border px-3 py-1 text-sm ${sortParam ? "border-gray-300" : "border-blue-500 text-blue-600"}`}
        >
          Default
        </Link>
        <Link
          href="?sort=title"
          className={`rounded-full border px-3 py-1 text-sm ${sortParam === "title" ? "border-blue-500 text-blue-600" : "border-gray-300"}`}
        >
          Title A→Z
        </Link>
      </div>
      <div className="mt-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Title</th>
                <th className="px-4 py-2 text-center text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {musics?.map((music) => {
                return (
                  <tr key={music.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-center sm:text-left">
                      {music.name || "Untitled track"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full sm:w-auto"
                          onClick={() => handleClick(music)}
                        >
                          Play
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full sm:w-auto"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure to delete '${music.name}'?`,
                              )
                            )
                              handleDestroy(music.id);
                          }}
                        >
                          Destroy
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && (!musics || musics.length === 0) && (
          <p className="px-4 py-6 text-center text-gray-600">
            No tracks yet. Upload a file to get started.
          </p>
        )}
      </div>
      <SectionSeparotr />
      <Uploader onFileUploaded={handleUpload} />
    </div>
  );
};

export default Musics;
