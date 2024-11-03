import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { Path } from "../../../types/Path";
import "./Menu.scss";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import { useTheme } from "../../../contexts/ThemeContext";

interface MenuProps {
  className: string;
}

const Menu = ({ className }: MenuProps) => {
  const { theme } = useTheme();
  const { data: user } = useAppSelector(selectUser);
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames("menu__link", { selected: isActive });

  const getLinks = (role: "admin" | "trainer" | "client") => {
    const links = [
      { to: ".", label: "Overview" },
      { to: Path.Settings, label: "Settings" },
    ];

    if (role === "admin") {
      links.splice(
        1,
        0,
        { to: Path.Users, label: "Users" },
        { to: Path.ScheduleEditor, label: "Schedule" }
      );
    } else if (role === "client") {
      links.splice(
        1,
        0,
        { to: Path.Schedule, label: "Schedule" }
        // { to: Path.Purchases, label: "Purchases" }
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
