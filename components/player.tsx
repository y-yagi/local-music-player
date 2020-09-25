import ReactHowler from "react-howler";
import MusicDatase from "../lib/music_database";
import useSWR from "swr";

const fetcher = (id: number) => {
  const db = new MusicDatase();
  return db.musics.where({ id: 1 }).first();
};

const Player = () => {
  const { data, error } = useSWR(1, fetcher);
  if (data === undefined) {
    return <section></section>;
  }
  const url = URL.createObjectURL(data.file);
  return <section>{/* <ReactHowler src={url} format={["mp3"]} /> */}</section>;
};

export default Player;
