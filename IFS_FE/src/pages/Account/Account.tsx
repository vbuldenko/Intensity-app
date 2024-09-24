import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import Menu from "./Menu";
import "./Account.scss";
import Loader from "../../components/Elements/Loader";

export default function Account() {
  const { data: user, loading, error } = useAppSelector(selectUser);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

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
