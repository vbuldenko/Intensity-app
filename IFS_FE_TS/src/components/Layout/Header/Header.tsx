// import { useState } from "react";
import { Logo } from "../../Elements/Logo";
import { Navigation } from "../../Navigation";
import { Toggler } from "../../Elements/Toggler";
import "./Header.scss";

export const Header = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__left">
        <Logo />
        <Navigation />
      </div>

      <div className="header__right">
        <Toggler />
        {/* <HamburgerMenu handleOpen={() => setIsMenuOpen(true)} /> */}
      </div>
      {/* <MobileMenu
        isOpen={isMenuOpen}
        handleClose={() => setIsMenuOpen(false)}
      /> */}
    </header>
  );
};
