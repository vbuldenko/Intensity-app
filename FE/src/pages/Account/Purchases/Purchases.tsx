import { useState } from "react";
// import { createAbonement } from "../../../reducers/abonementReducer";
import Selector from "../../../components/Buttons/Selector";
import { membership } from "../../../assets/purchaseData";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../app/features/user/userSlice";
import "./Purchases.scss";
import { abonementService } from "../../../services/abonementService";
import { getErrorMessage } from "../../../utils/utils";
import Notification from "../../../components/Elements/Notification";
import { useTranslation } from "react-i18next";
import { useNotification } from "../../../hooks/useNotification";

export default function Purchases({
  clientId,
  updater,
}: {
  clientId?: number;
  updater?: () => void;
}) {
  const { t } = useTranslation();
  const { notification, handleNotification } = useNotification();

  const { data: user } = useAppSelector(selectUser);
  // const dispatch = useAppDispatch();
  const [selectedType, setSelectedType] = useState<
    "group" | "personal" | "split"
  >("group");
  const [selectedAmountIndex, setSelectedAmountIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  const selectedAbonementData: { amount: number; price: number }[] =
    membership[selectedType] || [];
  const selectedAbonement: { amount: number; price: number } =
    selectedAbonementData[selectedAmountIndex];

  const handleSubmit = async () => {
    try {
      if (user && user.role === "admin" && clientId) {
        await abonementService.add({
          clientId,
          paymentMethod,
          type: selectedType,
          ...selectedAbonement,
        });
        handleNotification(
          `Abonement for ${selectedAbonement.amount} trainings was added`
        );
      } else if (selectedAbonement) {
        // await abonementService.add({
        //   ...selectedAbonement,
        //   type: selectedType,
        // });
        handleNotification("In development", "error");
      }
      if (updater) {
        updater();
      }
    } catch (error) {
      handleNotification(getErrorMessage(error), "error");
    } finally {
    }
  };

  const handleIncrement = () => {
    if (selectedAmountIndex < selectedAbonementData.length - 1) {
      setSelectedAmountIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedAmountIndex > 0) {
      setSelectedAmountIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleTypeChange = (type: typeof selectedType) => {
    setSelectedType(type);
    setSelectedAmountIndex(0); // Reset selected amount index when type changes
  };
  const handlePaymentMethodChange = (method: typeof paymentMethod) => {
    setPaymentMethod(method);
  };

  if (!user) {
    return null;
  }

  const buttonNames = [
    { value: "group", label: t("prices.categories.group") },
    { value: "personal", label: t("prices.categories.individual") },
    { value: "split", label: t("prices.categories.split") },
    // { value: "kids", label: t("prices.categories.children") },
  ];
  const paymentMethodButtonNames = [
    { value: "card", label: t("prices.card") },
    { value: "cash", label: t("prices.cash") },
  ];

  return (
    <div className="purchases">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <h3 className="purchases__title">{t("prices.choose")}</h3>

      <Selector
        selection={selectedType}
        handleSelection={handleTypeChange}
        buttonNames={buttonNames}
      />
      {user && user.role === "admin" && (
        <Selector
          selection={paymentMethod}
          handleSelection={handlePaymentMethodChange}
          buttonNames={paymentMethodButtonNames}
        />
      )}

      <div className="purchases__container card-element">
        <div className="purchases__info">
          {selectedAbonement && (
            <>
              <p className="purchases__info-price">
                {t("prices.price")}: {selectedAbonement.price} UAH
              </p>
              <p className="purchases__info-single-training">
                {t("prices.unit_price")}:{" "}
                {Math.trunc(
                  selectedAbonement.price / selectedAbonement.amount
                ) || null}{" "}
                ₴
              </p>
            </>
          )}
        </div>
        <div className="purchases__button-group">
          <button
            className="purchases__button purchases__button--decrement"
            onClick={handleDecrement}
          >
            -
          </button>
          <div className="purchases__badge">{selectedAbonement?.amount}</div>
          <button
            className="purchases__button purchases__button--increment"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
        <button className="purchases__submit-button" onClick={handleSubmit}>
          {user.role === "admin" && clientId
            ? "Додати абонемент"
            : "Перейти до оплати"}
        </button>
      </div>
    </div>
  );
}
