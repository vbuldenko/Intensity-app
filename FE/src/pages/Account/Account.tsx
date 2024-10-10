import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import "./Account.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { fetchUserData } from "../../features/user/userThunk";
import { selectUser } from "../../features/user/userSlice";

export default function Account() {
  const { data } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(fetchUserData());
    } else {
      document.documentElement.style.setProperty(
        "--root-font-size",
        `${data.settings.fontSize}px`
      );
    }
  }, [data, dispatch]);

  return (
    <section className="account card-element">
      <Menu className="account__menu" />

      <div className="account__content">
        <Outlet />
      </div>
    </section>
  );
}
