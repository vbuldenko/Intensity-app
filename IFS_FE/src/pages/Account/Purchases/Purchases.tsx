import { useState } from "react";
// import { notifyWith } from '../../../reducers/notificationReducer';
// import { createAbonement } from '../../../reducers/abonementReducer';
import Selector from "../../../components/Elements/Selector";
import { membership } from "../../../assets/purchaseData";
import "./Purchases.scss";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";

export default function Purchases({ clientId }) {
  // const notification = useSelector(({ notification }) => notification);
  const { data: user } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [selectedType, setSelectedType] = useState("Group"); // Default selected type
  const [selectedAmountIndex, setSelectedAmountIndex] = useState(0);

  const selectedAbonementData = membership[selectedType.toLowerCase()] || [];
  const selectedAbonement = selectedAbonementData[selectedAmountIndex];

  const handleSubmit = async () => {
    try {
      if (user.role === "admin" && clientId) {
        await dispatch(
          createAbonement({
            ...selectedAbonement,
            type: selectedType,
            clientId: clientId,
          })
        );
        dispatch(
          notifyWith(
            `Abonement for ${selectedAbonement.amount} trainings was added`
          )
        );
      } else if (selectedAbonement) {
        await dispatch(createAbonement(selectedAbonement));
        dispatch(
          notifyWith(
            `Abonement for ${selectedAbonement.amount} trainings was purchased`
          )
        );
      }
    } catch (error) {
      dispatch(notifyWith(error.response.data.error));
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

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSelectedAmountIndex(0); // Reset selected amount index when type changes
  };

  return (
    <div className="purchases">
      {/* {notification && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            padding: "0.5em",
          }}
        >
          {notification}
        </div>
      )} */}

      <h2 className="purchases__title">
        Оберіть тип занять та кількість тренувань
      </h2>

      <Selector
        selection={selectedType}
        handleSelection={handleTypeChange}
        buttonNames={["Group", "Personal", "Split", "Kids"]}
      />
      <div className="purchases__container card-element">
        <div className="purchases__info">
          {selectedAbonement && (
            <>
              <p className="purchases__info-price">
                Price: {selectedAbonement.price} UAH
              </p>
              <p className="purchases__info-single-training">
                1 training:{" "}
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
