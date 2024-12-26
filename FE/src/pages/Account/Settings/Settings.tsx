// import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../app/features/user/userSlice";
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
  UserIcon,
} from "@heroicons/react/24/outline";
import { User } from "../../../types/User";
import { logOut } from "../../../app/features/auth/authThunk";
import Loader from "../../../components/Elements/Loader";
import { updateUserData } from "../../../app/features/user/userThunk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../components/Elements/CustomSelect";

function Settings() {
  const { t } = useTranslation();
  const { data: user, loading } = useAppSelector(selectUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const handleFontSize = (fontSize: number | string) => {
    document.documentElement.style.setProperty(
      "--root-font-size",
      `${fontSize}px`
    );
    dispatch(updateUserData({ updateType: "fontSize", fontSize }));
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

  const { firstName, lastName, email, phone, settings } = user as User;

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

            <CustomSelect
              value={settings.fontSize}
              options={[10, 12, 14, 16, 18, 20]}
              onChange={handleFontSize}
            />
          </div>
        </div>
      </div>
      <div className="settings__section">
        <h3 className="settings__title">{t("settings.personal")}</h3>
        <div className="settings__info card-element">
          <div className="settings__info-item">
            <div className="settings__info-label w-full">
              <UserIcon className="icon icon--small" />
              <p className="text text--small">ID</p>
              <span className="text-amber-600 bg-amber-100 px-4 rounded-xl ml-auto">
                {user.id}
              </span>
            </div>
          </div>
          <div className="settings__info-item">
            <div className="settings__info-label">
              <IdentificationIcon className="icon icon--small" />
              <p className="text text--small">{t("settings.name")}</p>
              <p className="text text--highlighted">
                {firstName} {lastName}
              </p>
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
