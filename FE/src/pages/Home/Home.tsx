// import { data } from "../../assets/homeData";
import { useTranslation } from "react-i18next";
import { Hero } from "../../components/Hero";
import InfoSection from "../../components/InfoSection";
import "./Home.scss";
import { InfoItem } from "../../components/InfoSection/InfoSection";

export default function HomePage() {
  const { t } = useTranslation();

  const values = t("home.values", { returnObjects: true }) as InfoItem[];
  const rules = t("home.rules", { returnObjects: true }) as InfoItem[];

  return (
    <>
      <Hero />

      <InfoSection header={t("home.header_values")} items={values} />

      <InfoSection header={t("home.header_rules")} items={rules} />
    </>
  );
}
