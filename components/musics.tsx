import MusicDatase from "../lib/music_database";
import Player from "./player";
import Uploader from "./uploader";
import SectionSeparotr from "./section-separator";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MusicType from "../types/music";

const Musics = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [musics, setMusics] = useState<MusicType[] | undefined>(undefined);
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

  function handleClick(music: MusicType, setUrl: Function, setTitle: Function) {
    const url = URL.createObjectURL(music.file);
    setTitle(music.name);
    setUrl(url);
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

  if (musics === undefined) {
    fetchData();
  }

  return (
    <div>
      <Player url={url} title={title} />
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
                    onClick={() => handleClick(music, setUrl, setTitle)}
                  >
                    Play
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure to delete '${music.name}'?`
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
