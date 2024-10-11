import { prices } from "../../assets/pricesData";
import "./Prices.scss";

export default function PricesPage() {
  return (
    <div className="info-section">
      <h2 className="info-section__header">Абонементи</h2>
      <div className="info-section__list">
        {prices.map((el, i) => (
          <div key={i} className="info-section__item card-element">
            <h4 className="info-section__title accent-label-primary absolute top-0">
              {el.category}
            </h4>
            <div className="info-section__content mt-5">
              <div className="prices__metrics">
                <h4 className="prices__metric">Amount</h4>
                <h4 className="prices__metric">Price</h4>
                <h4 className="prices__metric">Unit Price</h4>
              </div>
              <div className="prices__items">
                {el.prices.map((price, index) => (
                  <div key={index} className="prices__item">
                    <p className="prices__element">
                      {price.amount}{" "}
                      {price.amount === 1 ? "training" : "trainings"}
                    </p>
                    <p className="prices__element">₴ {price.price}</p>
                    <p className="prices__element">
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
