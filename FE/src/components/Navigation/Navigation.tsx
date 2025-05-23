import React from "react";
import { NavLink } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { getLinkClass } from "../../utils/utils";
import { NavBarLinks } from "../../types/NavBarLinks";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/user/userSlice";
import { Path } from "../../types/Path";
import "./Navigation.scss";

type Props = {
  className?: string;
  handleClick?: () => void;
  // ref: React.RefObject<HTMLElement>;
};

export const Navigation: React.FC<Props> = ({
  // ref,
  className,
  handleClick,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector(selectUser);

  return (
    // <nav ref={ref} className={className ? `nav ${className}` : "nav"}>
    <nav className={className ? `nav ${className}` : "nav"}>
      <ul className="nav__list">
        {Object.entries(NavBarLinks).map(([key, value]) => (
          <li className="nav__item" key={key}>
            <NavLink to={value} className={getLinkClass} onClick={handleClick}>
              {t(`nav.${key.toLowerCase()}`)}
            </NavLink>
          </li>
        ))}
        {isAuthenticated ? (
          <li className="nav__item">
            <NavLink
              to={Path.Account}
              className={getLinkClass}
              onClick={handleClick}
            >
              <UserCircleIcon className="h-6 w-6" />
            </NavLink>
          </li>
        ) : (
          <li className="nav__item">
            <NavLink
              to={Path.Login}
              className={getLinkClass}
              onClick={handleClick}
            >
              {t("nav.login")}
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};
