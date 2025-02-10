import Slider from "../Slider/Slider";
import { useTranslation } from "react-i18next";
import { slides } from "../../assets/slides";
import "./Hero.scss";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <div className="hero self-center">
      <div className="hero__title">
        {t("welcome")}
        <span className="hero__title--accent">Intensity</span>
      </div>
      <div className="hero__slider">
        <Slider slides={slides} settings={{ autoplay: true, speed: 10000 }} />
      </div>

      <Link
        to="/account/buying"
        className="bg-teal-600 w-full text-center p-3 rounded-md hover:bg-teal-700"
      >
        {t("home.reserve")}
      </Link>
    </div>
  );
};
