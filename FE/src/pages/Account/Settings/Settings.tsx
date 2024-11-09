// import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import "./Settings.scss";

import {
  PhoneIcon,
  AtSymbolIcon,
  KeyIcon,
  IdentificationIcon,
  PencilSquareIcon,
  // UserMinusIcon,
  ArrowRightStartOnRectangleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { User } from "../../../types/User";
import { logOut } from "../../../features/auth/authThunk";
import Loader from "../../../components/Elements/Loader";
import { updateUserData } from "../../../features/user/userThunk";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Settings() {
  const { t } = useTranslation();
  const { data: user, loading } = useAppSelector(selectUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const handleFontSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontSize = parseInt(event.target.value, 10);
    document.documentElement.style.setProperty(
      "--root-font-size",
      `${newFontSize}px`
    );
    dispatch(updateUserData({ updateType: "fontSize", fontSize: newFontSize }));
  };

  const handleLogOut = async () => {
    setIsSubmitting(true);
    await dispatch(logOut());
    setIsSubmitting(false);
  };

  // const handleDelete = async () => {
  //   try {
  //     await dispatch(logOut());
  //     navigate("/sign-in", { replace: true });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (!user || loading) {
    return <Loader />;
  }

  const { firstName, email, phone, settings } = user as User;

  return (
    <div className="settings">
      <div className="settings__section">
        <h3 className="settings__title">{t("settings.general")}</h3>
        <div className="settings__info card-element">
          <div className="settings__info-item">
            <div className="settings__info-label">
              <AdjustmentsHorizontalIcon className="icon icon--small" />
              <p className="text text--small">{t("settings.fontSize")}</p>
            </div>
            <select
              id="fontSize"
              className="select select--small"
              onChange={handleFontSize}
              value={settings.fontSize}
            >
              {[10, 12, 14, 16, 18, 20].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="settings__section">
        <h3 className="settings__title">{t("settings.personal")}</h3>
        <div className="settings__info card-element">
          <div className="settings__info-item">
            <div className="settings__info-label">
              <IdentificationIcon className="icon icon--small" />
              <p className="text text--small">{t("settings.name")}</p>
              <p className="text text--highlighted">{firstName}</p>
            </div>
            <button className="button button--icon">
              <PencilSquareIcon className="icon icon--small" />
            </button>
          </div>
          <div className="settings__info-item">
            <div className="settings__info-label">
              <AtSymbolIcon className="icon icon--small" />
              <p className="text text--small">{t("settings.email")}</p>
              <p className="text text--highlighted text--wide">{email}</p>
            </div>
            <button className="button button--icon">
              <PencilSquareIcon className="icon icon--small" />
            </button>
          </div>
          <div className="settings__info-item">
            <div className="settings__info-label">
              <PhoneIcon className="icon icon--small" />
              <p className="text text--small">{t("settings.phone")}</p>
              <p className="text--highlighted">{phone}</p>
            </div>
            <button className="button button--icon">
              <PencilSquareIcon className="icon icon--small" />
            </button>
          </div>
          <div className="settings__info-item">
            <div className="settings__info-label">
              <KeyIcon className="icon icon--small" />
              <p className="text text--small">{t("settings.password")}</p>
            </div>
            <button className="button button--icon">
              <PencilSquareIcon className="icon icon--small" />
            </button>
          </div>
        </div>
      </div>
      <button
        className="settings__logout-button card-element"
        onClick={handleLogOut}
      >
        <ArrowRightStartOnRectangleIcon className="icon icon--small" />
        {isSubmitting && <div className="reservation-btn__spinner"></div>}
        {t("settings.logoutButton")}
      </button>
      {/* <div className="settings__section">
        <h3 className="settings__title">Account actions</h3>
        <div className="settings__info card-element">
          <div className="settings__info-item">
            <div className="settings__info-label">
              <ArrowRightStartOnRectangleIcon className="icon icon--small" />
              <p className="text text--small">Log yourself out:</p>
            </div>
            <button className="button button--action" onClick={handleLogOut}>
              <ArrowRightStartOnRectangleIcon className="icon icon--small" />
              {isSubmitting && <div className="reservation-btn__spinner"></div>}
              {!isSubmitting && t("settings.logoutButton")}
            </button>
          </div>
          <div className="settings__info-item">
            <div className="settings__info-label">
              <UserMinusIcon className="icon icon--small" />
              <p className="text text--small">Delete your account:</p>
            </div>
            <button className="button button--danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Settings;
