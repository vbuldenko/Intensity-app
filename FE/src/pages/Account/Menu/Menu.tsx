import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { NavLinks } from "../../../types/NavLinks";
import "./Menu.scss";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";

interface MenuProps {
  className: string;
}

const Menu = ({ className }: MenuProps) => {
  const { data: user } = useAppSelector(selectUser);
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames("menu__link", { selected: isActive });

  const getLinks = (role: "admin" | "trainer" | "client") => {
    const links = [
      { to: ".", label: "Overview" },
      { to: NavLinks.Settings, label: "Settings" },
    ];

    if (role === "admin") {
      links.splice(
        1,
        0,
        { to: NavLinks.Users, label: "Users" },
        { to: NavLinks.ScheduleEditor, label: "Schedule" }
      );
    } else if (role === "client") {
      links.splice(
        1,
        0,
        { to: NavLinks.Schedule, label: "Schedule" },
        { to: NavLinks.Purchases, label: "Purchases" }
      );
    }

    return links;
  };

  return (
    <nav className={`${className} menu`}>
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