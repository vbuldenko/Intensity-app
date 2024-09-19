import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { NavLinks } from "../../../types/NavLinks";

interface MenuProps {
  role: "admin" | "trainer" | "client"; // Direct role type
}

const Menu = ({ role }: MenuProps) => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames("account__menu-link", { active: isActive });

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
    <>
      {getLinks(role).map(({ to, label }) => (
        <NavLink key={to} to={to} className={getLinkClass}>
          {label}
        </NavLink>
      ))}
    </>
  );
};

export default Menu;
