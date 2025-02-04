import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Buying.scss";

const PaymentDetails = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="payment-details card-element">
      <button className="payment-details__toggle" onClick={toggleDropdown}>
        {isOpen ? "Сховати реквізити" : "Показати реквізити"}
      </button>
      <div className={`payment-details__content ${isOpen ? "open" : ""}`}>
        <div className="payment-details__container">
          <h2 className="payment-details__title">Отримувач</h2>
          <p className="payment-details__info">
            ФОП Морозова Анжела Валеріївна
          </p>
          <h2 className="payment-details__title">IBAN</h2>
          <p className="payment-details__info">UA563220010000026008330110861</p>
          <h2 className="payment-details__title">ІПН/ЄДРПОУ</h2>
          <p className="payment-details__info">3466712282</p>
          <h2 className="payment-details__title">Акціонерне товариство</h2>
          <p className="payment-details__info">УНІВЕРСАЛ БАНК</p>
          <h2 className="payment-details__title">МФО</h2>
          <p className="payment-details__info">322001</p>
          <h2 className="payment-details__title">ОКПО Банку</h2>
          <p className="payment-details__info">21133352</p>
        </div>
      </div>
    </div>
  );
};

const Buying = () => {
  const { t } = useTranslation();
  return (
    <div className="buying">
      <h1 className="buying__header">{t("prices.paymentDetails")}</h1>
      <p className="buying__description animation-zoomin">
        {t("prices.explanation")}
      </p>
      <div className="flex flex-col gap-2 buying__notes animation-zoomin">
        <span className="buying__note ">{t("prices.IBAN_note")}</span>
        <span className="buying__note text-yellow-300">
          {t("prices.buyingNote")}
        </span>
      </div>
      <div className="buying__option">
        <p className="buying__description">
          {t("prices.directPaymentDescription")}
        </p>
        <PaymentDetails />
      </div>
      <div className="buying__dotted-line"></div>
      <div className="buying__option">
        <p className="buying__description">{t("prices.linkDescription")}</p>
        <a
          href="https://bank.gov.ua/qr/QkNECjAwMgoyClVDVAoK1M7PIMzu8O7n7uLgIMDt5uXr4CDC4Ovl8LO_4u3gClVBNTYzMjIwMDEwMDAwMDI2MDA4MzMwMTEwODYxClVBSDAKMzQ2NjcxMjI4MgoKCs7v6-Dy4CDn4CDg4e7t5ezl7fIKCg"
          target="_blank"
          rel="noopener noreferrer"
          className="buying__button"
        >
          {t("prices.paymentLink")}
        </a>
      </div>
      <div className="buying__dotted-line"></div>
      <div className="buying__option">
        <p className="buying__description">{t("prices.qrCodeDescription")}</p>
        <div className="buying__qr-code">
          <img
            src="/QR/FOP_noframe_monologo.svg"
            alt="QR Code"
            className="buying__qr-code-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Buying;
