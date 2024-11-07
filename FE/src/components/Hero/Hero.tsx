import Slider from "../Slider/Slider";
import { useTranslation } from "react-i18next";
import { slides } from "../../assets/slides";
import "./Hero.scss";

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <div className="hero self-center">
      <h2 className="hero__title">
        {t("welcome_to")} <span className="hero__title--accent">Intensity</span>{" "}
        {t("fitness_studio")}
      </h2>
      <div className="hero__slider">
        <Slider slides={slides} settings={{ autoplay: true, speed: 10000 }} />
      </div>
    </div>
  );
};
