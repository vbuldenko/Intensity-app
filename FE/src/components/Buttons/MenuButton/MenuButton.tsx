import classNames from "classnames";
import "./MenuButton.scss";

type Props = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export const MenuButton: React.FC<Props> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <button
      className={classNames("burger-menu", { open: isMenuOpen })}
      onClick={toggleMenu}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};
