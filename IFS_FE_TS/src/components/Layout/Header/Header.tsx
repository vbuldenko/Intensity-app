import { useState } from "react";
import { Navigation } from "../../Navigation";
import { Logo } from "../../Elements/Logo";
import { Toggler } from "../../Elements/Toggler";
import { MenuButton } from "../../Elements/MenuButton";
import "./Header.scss";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
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
