import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function ContactsPage() {
  return (
    <section className="info-section">
      <h2 className="info-section__header">Наші контакти</h2>
      <div className="info-section__list">
        <div className="info-section__item card-element">
          <h4 className="info-section__title accent-label-primary top-0 absolute">
            Наші контакти
          </h4>
          <div className="info-section__content mt-8">
            <div className="info-section__element">
              <PhoneIcon className="icon" />
              <p>+38(097)-99-100-70</p>
            </div>
            <div className="info-section__element">
              <EnvelopeIcon className="icon" />
              <p>in10sity.trainer@gmail.com</p>
            </div>
            <div className="info-section__element">
              <MapPinIcon className="icon" />
              <p>Volodymyra Ivasiuka Ave, 24, Kyiv, 04210</p>
            </div>
          </div>
        </div>
        <div className="info-section__item card-element">
          <h4 className="info-section__title accent-label-primary top-0 absolute">
            Графік роботи
          </h4>
          <div className="info-section__content mt-8">
            <div className="info-section__element">
              <ClockIcon className="icon" />
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
