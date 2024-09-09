import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import "./Contacts.scss";

export default function ContactsPage() {
  return (
    <section className="contacts">
      <h1 className="contacts__header">Наші контакти</h1>
      <div className="contacts__list">
        <div className="contacts__element card-element">
          <span className="contacts__category accent-label-primary">
            Наші контакти
          </span>
          <div className="contacts__items">
            <div className="contacts__item">
              <PhoneIcon className="contacts__icon" />
              <p>+38(097)-99-100-70</p>
            </div>
            <div className="contacts__item">
              <EnvelopeIcon className="contacts__icon" />
              <p>in10sity.trainer@gmail.com</p>
            </div>
            <div className="contacts__item">
              <MapPinIcon className="contacts__icon" />
              <p>Volodymyra Ivasiuka Ave, 24, Kyiv, 04210</p>
            </div>
          </div>
        </div>
        <div className="contacts__element card-element">
          <span className="contacts__category accent-label-primary">
            Графік роботи
          </span>
          <div className="contacts__items">
            <div className="contacts__item">
              <ClockIcon className="contacts__icon" />
              <p>
                Пн-Пт - з 9:00 до 21:00 <br /> Сб - з 9:00 до 15:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
