import Slider from "../Slider/Slider";
import { slides } from "../../assets/slides";
import "./Hero.scss";

export const Hero = () => {
  return (
    <div className="hero self-center">
      <h1 className="hero__title">
        Welcome to <span className="hero__title--accent">Intensity</span>{" "}
        fitness studio!
      </h1>
      <div className="hero__slider">
        <Slider slides={slides} settings={{ autoplay: true, speed: 10000 }} />
      </div>
    </div>
  );
};
