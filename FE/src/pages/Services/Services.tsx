import { useTranslation } from "react-i18next";
// import { data } from "../../assets/servicesData";
import InfoSection, {
  InfoItem,
} from "../../components/InfoSection/InfoSection";
import "./Services.scss";

export default function ServicesPage() {
  const { t } = useTranslation();

  const classes = t("services.classes", { returnObjects: true }) as InfoItem[];
  const trainings = t("services.trainings", {
    returnObjects: true,
  }) as InfoItem[];

  return (
    <>
      <InfoSection header={t("services.header_classes")} items={trainings} />
      <InfoSection header={t("services.header_trainings")} items={classes} />
    </>
  );
}
