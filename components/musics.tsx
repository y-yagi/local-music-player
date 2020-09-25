import MusicDatase from "../lib/music_database";
import useSWR from "swr";

const fetcher = (id: number) => {
  const db = new MusicDatase();
  return db.musics.toArray();
};

const Musics = () => {
  const { data, error } = useSWR(3, fetcher);
  console.log(error);
  if (data === undefined) {
    return <span></span>;
  }

  // TODO: Fix the case taht data is only one.

  return (
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
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
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
  );
};

export default Musics;
