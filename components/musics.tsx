import MusicDatase from "../lib/music_database";
import Player from "./player";
import { useState } from "react";
import MusicType from "../types/music";

const Musics = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [musics, setMusics] = useState<MusicType[] | undefined>(undefined);

  async function fetchData() {
    const db = new MusicDatase();
    const musics = await db.musics.toArray();
    setMusics(musics);
  }

  function handleClick(music: any, setUrl: Function, setTitle: Function) {
    const url = URL.createObjectURL(music.file);
    setTitle(music.name);
    setUrl(url);
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

  // TODO: Fix the case taht data is only one.

  return (
    <div>
      <Player url={url} title={title} />
      <hr />
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {musics?.map((music) => {
            return (
              <tr key={music.id}>
                <td className="border px-4 py-2">{music.name}</td>
                <td className="border px-4 py-2 space-x-4">
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
                          "Are you sure you wish to delete this item?"
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
    </div>
  );
};

export default Musics;
