import { useTheme } from "../../../contexts/ThemeContext";
import { NavBarLinks } from "../../../types/NavBarLinks";
import { scrollToTop } from "../../../utils/utils";
import { Logo } from "../../Elements/Logo";
import "./Footer.scss";

export const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className={`footer ${theme}`}>
      <div className="container footer__content">
        <Logo className="footer__logo" />

        <ul className="nav__list footer__list">
          {Object.entries(NavBarLinks).map(([key, value]) => (
            <li className="nav__item" key={key}>
              <a href={value} className="nav__link">
                {key}
              </a>
            </li>
          ))}
        </ul>

        <button className="footer__button" onClick={scrollToTop}>
          Back to top
          <span className="footer__button-icon icon icon--arrow-up"></span>
        </button>
      </div>
    </footer>
  );
};
