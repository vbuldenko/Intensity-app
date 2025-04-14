// import { useRef, useState } from "react";
import { useState } from "react";
import { Navigation } from "../../Navigation";
import { Logo } from "../../Elements/Logo";
import { MenuButton } from "../../Buttons/MenuButton";
import "./Header.scss";
import { useTheme } from "../../../contexts/ThemeContext";
import CustomSelect from "../../Buttons/CustomSelect";
import { useTranslation } from "react-i18next";
// import useClickOutside from "../../../hooks/useClickOutside";

export const Header = () => {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<"ua" | "en">("ua");
  // const navigationRef = useRef<HTMLElement>(null);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  // useClickOutside(navigationRef, closeMobileMenu);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  function handleChangeLanguage(value: "ua" | "en") {
    setLang(value);
    i18n.changeLanguage(value);
  }

  return (
    <header className={`header ${theme}`}>
      <div className="header__left">
        <Logo />
        <Navigation
          className={isMenuOpen ? "mobile" : ""}
          handleClick={closeMobileMenu}
          // ref={navigationRef}
        />
      </div>

      <div className="header__right gap-4">
        <CustomSelect
          value={lang}
          options={["ua", "en"]}
          onChange={handleChangeLanguage}
        />
        {/* <Toggler /> */}
        <MenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
    </header>
  );
};
