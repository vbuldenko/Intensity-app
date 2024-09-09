import { useState } from "react";
import { Navigation } from "../../Navigation";
import { Logo } from "../../Elements/Logo";
import { Toggler } from "../../Elements/Toggler";
import { MenuButton } from "../../Elements/MenuButton";
import "./Header.scss";
import { useTheme } from "../../../contexts/ThemeContext";

export const Header = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${theme}`}>
      <div className="header__left">
        <Logo />
        <Navigation
          className={isMenuOpen ? "mobile" : ""}
          handleClick={closeMobileMenu}
        />
      </div>

      <div className="header__right">
        <Toggler />
        <MenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
    </header>
  );
};
