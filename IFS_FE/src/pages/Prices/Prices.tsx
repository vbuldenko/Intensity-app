import { prices } from "../../assets/pricesData";
import "./Prices.scss";

export default function PricesPage() {
  return (
    <div className="prices">
      <h1 className="prices__header">Абонементи</h1>
      <div className="prices__list">
        {prices.map((el, i) => (
          <div key={i} className="prices__element card-element">
            <span className="prices__category accent-label-primary">
              {el.category}
            </span>
            <div className="prices__details">
              <div className="prices__metrics">
                <p className="prices__metric">Amount</p>
                <p className="prices__metric">Price</p>
                <p className="prices__metric">Unit Price</p>
              </div>
              <div className="prices__items">
                {el.prices.map((price, index) => (
                  <div key={index} className="prices__item">
                    <p className="prices__item-amount">
                      {price.amount}{" "}
                      {price.amount === 1 ? "training" : "trainings"}
                    </p>
                    <p className="prices__item-price">₴ {price.price}</p>
                    <p className="prices__item-unit-price">
                      ₴ {price.price / price.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
