import ReactAudioPlayer from "react-audio-player";
import { useEffect, useRef } from "react";

const SKIP_INTERVALS = [60, 10];

type Props = {
  url: string;
  title: string;
  seekTime?: number | null;
  onSeekApplied?: () => void;
};

const Player = (props: Props) => {
  const audioRef = useRef<ReactAudioPlayer>(null);

  if (typeof navigator !== "undefined" && navigator && navigator.mediaSession) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: props.title,
    });
    navigator.mediaSession.playbackState = "playing";
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("seekbackward", handleSeekBackward);
    navigator.mediaSession.setActionHandler("seekforward", handleSeekForward);
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

  function skipBy(offset: number) {
    if (typeof document === "undefined") {
      return;
    }

    const audio = document.querySelector("audio");
    if (!audio) {
      return;
    }

    const targetTime = audio.currentTime + offset;
    const duration = audio.duration;
    if (Number.isFinite(duration)) {
      audio.currentTime = Math.min(Math.max(0, targetTime), duration);
      return;
    }

    audio.currentTime = Math.max(0, targetTime);
  }

  function handleSeekBackward(details?: MediaSessionActionDetails) {
    const offset = details?.seekOffset ?? SKIP_INTERVALS[0];
    skipBy(-offset);
  }

  function handleSeekForward(details?: MediaSessionActionDetails) {
    const offset = details?.seekOffset ?? SKIP_INTERVALS[0];
    skipBy(offset);
  }

  useEffect(() => {
    if (props.seekTime === null || props.seekTime === undefined) {
      return;
    }

    const audio = audioRef.current?.audioEl.current;
    if (!audio) {
      return;
    }

    const applySeek = () => {
      audio.currentTime = props.seekTime ?? 0;
      audio.play().catch(() => {});
      props.onSeekApplied?.();
    };

    if (audio.readyState >= 1) {
      applySeek();
      return;
    }

    const handleLoaded = () => {
      applySeek();
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [props.seekTime, props.onSeekApplied]);

  if (props.url === "") {
    return <section></section>;
  }

  // TODO: Get format from title.
  return (
    <section className="space-y-3">
      <div className="md:flex">
        <span className="block mt-1 text-lg leading-tight font-semibold text-green-500 hover:underline space-x-4">
          {props.title}
        </span>
      </div>
      {
        <ReactAudioPlayer
          ref={audioRef}
          src={props.url}
          autoPlay
          controls
          loop
          className="w-full"
        />
      }
      <div className="mt-4 flex flex-wrap gap-3" aria-label="Skip controls">
        {SKIP_INTERVALS.map((seconds) => (
          <div key={seconds} className="flex gap-2">
            <button
              type="button"
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-4 rounded-full"
              onClick={() => skipBy(-seconds)}
              data-testid={`skip-back-${seconds}`}
            >
              Back {seconds}s
            </button>
          </div>
        ))}
        {SKIP_INTERVALS.toReversed().map((seconds) => (
          <div key={seconds} className="flex gap-2">
            <button
              type="button"
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-4 rounded-full"
              onClick={() => skipBy(seconds)}
              data-testid={`skip-forward-${seconds}`}
            >
              Forward {seconds}s
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Player;
