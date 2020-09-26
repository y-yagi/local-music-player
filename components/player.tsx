import ReactHowler from "react-howler";

const Player = (props: any) => {
  if (props.url === "") {
    return <section></section>;
  }

  return <section>{<ReactHowler src={props.url} format={["mp3"]} />}</section>;
};

export default Player;
