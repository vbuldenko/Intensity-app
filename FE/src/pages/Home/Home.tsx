// import { data } from "../../assets/homeData";
import { useTranslation } from "react-i18next";
import { Hero } from "../../components/Hero";
import InfoSection from "../../components/InfoSection";
import "./Home.scss";
import { InfoItem } from "../../components/InfoSection/InfoSection";

export default function HomePage() {
  const { t } = useTranslation();

  const values = t("values", { returnObjects: true }) as InfoItem[];
  const rules = t("rules", { returnObjects: true }) as InfoItem[];

  return (
    <>
      <Hero />

      <InfoSection header={t("our_values")} items={values} />

      <InfoSection header={t("our_rules")} items={rules} />
    </>
  );
}
