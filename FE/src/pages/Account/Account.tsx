import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/user/userSlice";
import { checkAuth, fetchUserData } from "../../app/features/user/userThunk";
import Menu from "./Menu";
import "./Account.scss";

export default function Account() {
  const { data, error } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      dispatch(checkAuth());
    } else if (!data) {
      dispatch(fetchUserData());
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
