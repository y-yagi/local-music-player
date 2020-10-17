import ReactAudioPlayer from "react-audio-player";

type Props = {
  url: string;
  title: string;
};

const Player = (props: Props) => {
  if (props.url === "") {
    return <section></section>;
  }

  if (typeof navigator !== "undefined" && navigator && navigator.mediaSession) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: props.title,
    });
    navigator.mediaSession.playbackState = "playing";
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
  }

  function play() {
    if (
      typeof navigator !== "undefined" &&
      navigator &&
      navigator.mediaSession
    ) {
      const audio = document.querySelector("audio");
      audio?.play();
      navigator.mediaSession.playbackState = "playing";
    }
  }

  function pause() {
    if (
      typeof navigator !== "undefined" &&
      navigator &&
      navigator.mediaSession
    ) {
      const audio = document.querySelector("audio");
      audio?.pause();
      navigator.mediaSession.playbackState = "paused";
    }
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
