import MusicDatase from "../lib/music_database";
import Player from "./player";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (_: any) => {
  const db = new MusicDatase();
  return db.musics.toArray();
};

const Musics = () => {
  const { data, error } = useSWR("dummy key", fetcher);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  function handleClick(music: any, setUrl: Function, setTitle: Function) {
    const url = URL.createObjectURL(music.file);
    setTitle(music.name);
    setUrl(url);
  }

  async function handleDestroy(id: number) {
    const db = new MusicDatase();
    await db.musics.where("id").anyOf(id).delete();
    window.location.reload();
  }

  if (data === undefined) {
    return <span></span>;
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
          {data.map((music) => {
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
                    onClick={() => handleDestroy(music.id)}
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
