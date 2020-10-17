import ReactAudioPlayer from "react-audio-player";

type Props = {
  url: string;
  title: string;
};

const Player = (props: Props) => {
  if (props.url === "") {
    return <section></section>;
  }

  // TODO: Get format from title.
  return (
    <section>
      <div className="md:flex">
        <span className="block mt-1 text-lg leading-tight font-semibold text-green-500 hover:underline space-x-4">
          {props.title}
        </span>
      </div>
      {<ReactAudioPlayer src={props.url} autoPlay controls loop />}
    </section>
  );
};

export default Player;
