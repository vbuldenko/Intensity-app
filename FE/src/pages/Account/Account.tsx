import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import "./Account.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { fetchUserData } from "../../app/features/user/userThunk";
import { selectUser } from "../../app/features/user/userSlice";
import { checkAuth } from "../../app/features/auth/authThunk";
import { fetchAbonements } from "../../app/features/abonements/abonementThunk";

export default function Account() {
  const { data, error } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      dispatch(checkAuth());
    } else if (!data) {
      dispatch(fetchUserData());
      dispatch(fetchAbonements());
    } else {
      document.documentElement.style.setProperty(
        "--root-font-size",
        `${data.settings.fontSize}px`
      );
    }
  }, [data, error, dispatch]);

  return (
    <section className="account">
      <Menu className="account__menu" />

      <div className="account__content">
        <Outlet />
      </div>
    </section>
  );
}
