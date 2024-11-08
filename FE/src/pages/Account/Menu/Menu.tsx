import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { Path } from "../../../types/Path";
import "./Menu.scss";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

interface MenuProps {
  className: string;
}

const Menu = ({ className }: MenuProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data: user } = useAppSelector(selectUser);
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames("menu__link", { selected: isActive });

  const getLinks = (role: "admin" | "trainer" | "client") => {
    const links = [
      { to: ".", label: t("menu.overview") },
      { to: Path.Settings, label: t("menu.settings") },
    ];

    if (role === "admin") {
      links.splice(
        1,
        0,
        { to: Path.Users, label: t("menu.users") },
        { to: Path.ScheduleEditor, label: t("menu.schedule") }
      );
    } else if (role === "client") {
      links.splice(
        1,
        0,
        { to: Path.Schedule, label: t("menu.schedule") }
        // { to: Path.Purchases, label: t("menu.purchases")}
      );
    }

    return links;
  };

  return (
    <nav className={`menu ${theme} ${className}`}>
      {user &&
        getLinks(user.role).map(({ to, label }) => (
          //"end" used to handle isActive prop for index route
          <NavLink key={to} to={to} end={to === "."} className={getLinkClass}>
            {label}
          </NavLink>
        ))}
    </nav>
  );
};

export default Menu;
