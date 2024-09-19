import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { NavLinks } from "../../../types/NavLinks";
import "./Menu.scss";

interface MenuProps {
  role: "admin" | "trainer" | "client"; // Direct role type
  className: string;
}

const Menu = ({ role, className }: MenuProps) => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames("menu__link", { selected: isActive });

  const getLinks = (role: MenuProps["role"]) => {
    const links = [
      { to: ".", label: "Overview" },
      { to: NavLinks.Settings, label: "Settings" },
    ];

    if (role === "admin") {
      links.splice(
        1,
        0,
        { to: NavLinks.Clients, label: "Clients" },
        { to: NavLinks.Team, label: "Team" }
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
      {getLinks(role).map(({ to, label }) => (
        <NavLink key={to} to={to} className={getLinkClass}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Menu;
