import { ReactNode, FC } from "react";

type Props = {
  children?: ReactNode;
};

const Container: FC<Props> = (props) => {
  return <div className="container mx-auto px-5">{props.children}</div>;
};

export default Container;
