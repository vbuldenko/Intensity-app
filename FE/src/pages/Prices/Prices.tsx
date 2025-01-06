import { useTranslation } from "react-i18next";
import { prices } from "../../assets/pricesData";
import "./Prices.scss";

export default function PricesPage() {
  const { t } = useTranslation();
  return (
    <div className="info-section">
      <h2 className="info-section__header">{t("prices.abonements")}</h2>
      <div className="info-section__list">
        {prices.map((el, i) => (
          <div key={i} className="info-section__item card-element">
            <h4 className="info-section__title accent-label-primary absolute top-0">
              {t(`prices.categories.${el.category.toLowerCase()}`)}
            </h4>
            <div className="info-section__content mt-5">
              <div className="prices__metrics">
                <p className="prices__metric">{t("prices.amount")}</p>
                <p className="prices__metric">{t("prices.price")}</p>
                <p className="prices__metric">{t("prices.unit_price")}</p>
              </div>
              <div className="prices__items">
                {el.prices.map((price, index) => (
                  <div key={index} className="prices__item">
                    <p className="prices__element">{price.amount}</p>
                    <p className="prices__element">₴ {price.price}</p>
                    <p className="prices__element">
                      ₴ {(price.price / price.amount).toFixed()}
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
