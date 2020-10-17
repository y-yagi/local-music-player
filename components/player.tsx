import ReactHowler from "react-howler";
import { useState } from "react";

type Props = {
  url: string;
  title: string;
};

const Player = (props: Props) => {
  const [playing, setPlaying] = useState(true);

  if (typeof navigator !== "undefined" && navigator && navigator.mediaSession) {
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
  }

  function action() {
    if (playing === true) {
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  }

  function actionText() {
    if (playing === true) {
      return "Stop";
    } else {
      return "Start";
    }
  }

  function play() {
    if (
      typeof navigator !== "undefined" &&
      navigator &&
      navigator.mediaSession
    ) {
      setPlaying(true);
      navigator.mediaSession.playbackState = "playing";
    }
  }

  function pause() {
    if (
      typeof navigator !== "undefined" &&
      navigator &&
      navigator.mediaSession
    ) {
      setPlaying(false);
      navigator.mediaSession.playbackState = "paused";
    }
  }

  function onPlay() {
    if (
      typeof navigator !== "undefined" &&
      navigator &&
      navigator.mediaSession
    ) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: props.title,
      });
      navigator.mediaSession.playbackState = "playing";
    }
  }

  if (props.url === "") {
    return <section></section>;
  }

  // TODO: Get format from title.
  return (
    <section>
      {
        <ReactHowler
          src={props.url}
          format={["mp3"]}
          playing={playing}
          loop={true}
          onPlay={() => onPlay()}
        />
      }
      <section>
        <div className="md:flex">
          <div className="mt-4 md:mt-0 md:ml-6">
            <div className="flex space-x-4">
              <span className="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline space-x-4">
                {props.title}
              </span>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => action()}
              >
                {actionText()}
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Player;
