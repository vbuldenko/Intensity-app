import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Hero } from "../../components/Hero";
import InfoSection from "../../components/InfoSection";
import { InfoItem } from "../../components/InfoSection/InfoSection";
import "./Home.scss";

export default function HomePage() {
  const { t } = useTranslation();

  const values = t("home.values", { returnObjects: true }) as InfoItem[];
  const rules = t("home.rules", { returnObjects: true }) as InfoItem[];

  return (
    <>
      <Hero />

      <Link
        to="/account/buying"
        className="bg-teal-600 w-full text-center p-3 rounded-md hover:bg-teal-700"
      >
        {t("home.reserve")}
      </Link>

      <InfoSection header={t("home.header_values")} items={values} />

      <InfoSection header={t("home.header_rules")} items={rules} />
    </>
  );
}
