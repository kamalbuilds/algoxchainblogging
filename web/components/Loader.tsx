import React from "react";

type Props = {
  show: boolean;
};

const Loader: React.FC<Props> = ({ show }) => {
  return show && <div className="loader" />;
};

export default Loader;
