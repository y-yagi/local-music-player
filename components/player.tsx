import ReactHowler from "react-howler";
import { useState } from "react";

const Player = (props: any) => {
  const [playing, setPlaying] = useState(true);

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

  if (props.url === "") {
    return (
      <section>
        <div className="md:flex">
          <div className="mt-4 md:mt-0 md:ml-6">
            <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold">
              Stopping
            </div>
          </div>
        </div>
      </section>
    );
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
        />
      }
      <section>
        <div className="md:flex">
          <div className="mt-4 md:mt-0 md:ml-6">
            <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold">
              Playing
            </div>
            <div className="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline space-x-4">
              {props.title}
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
