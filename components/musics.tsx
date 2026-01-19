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

  async function fetchData() {
    const db = new MusicDatase();
    try {
      const musics = await db.musics.orderBy("id").toArray();
      if (sort === "title") {
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
  }, [sort]);

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
      <div className="flex flex-wrap gap-3 my-4" aria-label="Bookmark controls">
        {isPlaying && (
          <button
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-full"
            type="button"
            onClick={handleBookmarkSave}
            disabled={currentMusicId === null}
          >
            Remember current spot
          </button>
        )}
        {bookmark && (
          <button
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-full"
            type="button"
            onClick={handleBookmarkPlay}
          >
            Play saved spot: {formatBookmarkLabel(bookmark)}
          </button>
        )}
      </div>
      <hr />

      <div className="flex justify-center">
        <Link href="?sort=title">Sort by Title</Link>
      </div>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {musics?.map((music) => {
            return (
              <tr key={music.id} className="border-2 border-gray-600">
                <td className="border px-4 py-2 space-x-2 text-center block lg:table-cell">
                  {music.name}
                </td>
                <td className="border px-4 py-2 space-x-2 text-center block lg:table-cell">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => handleClick(music)}
                  >
                    Play
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <SectionSeparotr />
      <Uploader onFileUploaded={handleUpload} />
    </div>
  );
};

export default Musics;
