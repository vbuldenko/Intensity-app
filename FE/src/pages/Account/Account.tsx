import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/user/userSlice";
import { checkAuth, fetchUserData } from "../../app/features/user/userThunk";
import { selectAbonements } from "../../app/features/abonements/abonementSlice";
import { fetchAbonements } from "../../app/features/abonements/abonementThunk";
import Notification from "../../components/Elements/Notification";
import Menu from "./Menu";
import "./Account.scss";

export default function Account() {
  const { data, error } = useAppSelector(selectUser);
  const abonements = useAppSelector(selectAbonements);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      dispatch(checkAuth());
    } else if (!data) {
      dispatch(fetchUserData());
    } else {
      if ((data.role === "client" || data.role === "admin") && !abonements) {
        dispatch(fetchAbonements());
      }
      document.documentElement.style.setProperty(
        "--root-font-size",
        `${data.settings.fontSize}px`
      );
    }
  }, [data, error, dispatch, abonements]);

  if (error) {
    return <Notification message={error} type="error" />;
  }

  return (
    <section className="account">
      <Menu className="account__menu" />

      <div className="account__content">
        <Outlet />
      </div>
    </section>
  );
}
