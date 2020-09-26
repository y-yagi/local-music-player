import MusicDatase from "../lib/music_database";
import Player from "./player";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (id: number) => {
  const db = new MusicDatase();
  return db.musics.toArray();
};

function handleClick(music: any, setter: Function) {
  const url = URL.createObjectURL(music.file);
  setter(url);
}

const Musics = () => {
  const { data, error } = useSWR(3, fetcher);
  const [url, setUrl] = useState("");

  if (data === undefined) {
    return <span></span>;
  }

  // TODO: Fix the case taht data is only one.

  return (
    <div>
      <Player url={url} />
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
                    onClick={() => handleClick(music, setUrl)}
                  >
                    Play
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
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
