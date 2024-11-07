import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function ContactsPage() {
  const { t } = useTranslation();
  return (
    <section className="info-section">
      {/* <h2 className="info-section__header">{t("contacts.header")}</h2> */}
      <div className="info-section__list">
        <div className="info-section__item card-element">
          <h4 className="info-section__title accent-label-primary top-0 absolute">
            {t("contacts.header")}
          </h4>
          <div className="info-section__content mt-8">
            <div className="info-section__element">
              <PhoneIcon className="icon" />
              <p>{t("contacts.phone")}</p>
            </div>
            <div className="info-section__element">
              <EnvelopeIcon className="icon" />
              <p>{t("contacts.email")}</p>
            </div>
            <div className="info-section__element">
              <MapPinIcon className="icon" />
              <p>{t("contacts.address")}</p>
            </div>
          </div>
        </div>
        <div className="info-section__item card-element">
          <h4 className="info-section__title accent-label-primary top-0 absolute">
            {t("contacts.schedule")}
          </h4>
          <div className="info-section__content mt-8">
            <div className="info-section__element">
              <ClockIcon className="icon" />
              <p>{t("contacts.working_hours")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
