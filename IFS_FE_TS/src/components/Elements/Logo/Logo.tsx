import React from "react";
import { Link } from "react-router-dom";
import "./Logo.scss";

type Props = {
  className?: string;
};

export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <div className={className ? `logo ${className}` : "logo"}>
      <Link to={`/`}>
        {/* <img src="./icons/Logo.svg" alt="Logo" className="logo__image" /> */}
        Intensity
      </Link>
    </div>
  );
};
