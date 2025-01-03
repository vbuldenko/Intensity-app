import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../../contexts/ThemeContext";
import { NavBarLinks } from "../../../types/NavBarLinks";
import { getLinkClass, scrollToTop } from "../../../utils/utils";
import { Logo } from "../../Elements/Logo";
import "./Footer.scss";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export const Footer = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <footer className={`footer ${theme}`}>
      <div className="container footer__content">
        <div className="flex flex-col gap-1">
          <Logo className="footer__logo" />
          <p>{t("contacts.working_title")}</p>
          <p>{t("contacts.working_hours")}</p>
        </div>

        <nav>
          <h2 className="footer__nav-title">{t("gen.info")}</h2>
          <ul className="footer__nav-list">
            {Object.entries(NavBarLinks).map(([key, value]) => (
              <li className="footer__nav-item" key={key}>
                <NavLink to={value} className={getLinkClass}>
                  {t(`nav.${key.toLowerCase()}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="footer__nav-title">{t("contacts.title")}</h2>
            <p>{t("contacts.address")}</p>
            <p>{t("contacts.phone")}</p>
            <p>{t("contacts.email")}</p>
          </div>

          <div>
            <h2 className="footer__nav-title">{t("contacts.followus")}</h2>
            <div className="footer__socials">
              <a
                href="https://www.facebook.com/profile.php?id=100091428013477"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={"icons/fb.svg"}
                  alt="Facebook"
                  className="footer__social-icon"
                />
              </a>
              <a
                href="https://www.instagram.com/intensity_studio/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={"icons/insta.svg"}
                  alt="Instagram"
                  className="footer__social-icon"
                />
              </a>
              <a
                href="https://t.me/+3eJJ4RWaU8oxYzAy"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={"icons/t.svg"}
                  alt="Telegram"
                  className="footer__social-icon"
                />
              </a>
            </div>
          </div>
        </div>

        <button className="footer__button" onClick={scrollToTop}>
          <ArrowUpIcon className="footer__button-icon" />
        </button>
      </div>
    </footer>
  );
};
