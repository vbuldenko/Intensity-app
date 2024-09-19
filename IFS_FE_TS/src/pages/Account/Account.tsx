import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import Menu from "./Menu";
import "./Account.scss";

export default function Account() {
  const { data: user, loading, error } = useAppSelector(selectUser);

  return (
    user && (
      <section className="account card-element">
        <nav className="account__menu">
          <Menu role={user.role} />
        </nav>
        <div className="account__content">
          <Outlet />
        </div>
      </section>
    )
  );
}
