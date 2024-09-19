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
        <Menu className="account__menu" role={user.role} />

        <div className="account__content">
          <Outlet />
        </div>
      </section>
    )
  );
}
