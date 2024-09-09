import { data } from "../../assets/homeData";
import { Hero } from "../../components/Hero";
import "./Home.scss";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="info-section">
        <h1 className="info-section__header">Наші цінності</h1>
        <div className="info-section__list">
          {data.values.map((value, index) => (
            <div className="info-section__item" key={index}>
              <h2 className="info-section__title">{value.value}</h2>
              <p className="info-section__text">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h1 className="info-section__header">Правила студії</h1>
        <div className="info-section__list">
          {data.rules.map((rule, index) => (
            <div className="info-section__item" key={index}>
              <p className="info-section__text">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
