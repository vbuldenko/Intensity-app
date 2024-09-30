import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import "./Account.scss";

export default function Account() {
  return (
    <section className="account card-element">
      <Menu className="account__menu" />

      <div className="account__content">
        <Outlet />
      </div>
    </section>
  );
}
