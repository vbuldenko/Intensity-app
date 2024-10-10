import { data } from "../../assets/homeData";
import { Hero } from "../../components/Hero";
import InfoSection from "../../components/InfoSection";
import "./Home.scss";

export default function HomePage() {
  return (
    <>
      <Hero />

      <InfoSection header="Наші цінності" items={data.values} />

      <InfoSection header="Правила студії" items={data.rules} />
    </>
  );
}
