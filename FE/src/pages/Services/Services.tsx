import { useTranslation } from "react-i18next";
// import { data } from "../../assets/servicesData";
import InfoSection, {
  InfoItem,
} from "../../components/InfoSection/InfoSection";
import "./Services.scss";
import InfoImage from "../../components/InfoImage";

export default function ServicesPage() {
  const { t } = useTranslation();

  const classes = t("services.classes", { returnObjects: true }) as InfoItem[];
  const trainings = t("services.trainings", {
    returnObjects: true,
  }) as InfoItem[];

  const classImgs = [
    "/images/services/group.jpg",
    "/images/services/personal.jpg",
    "/images/services/split.jpg",
    // Add more image paths as needed
  ];
  const trainingImgs = [
    "/images/services/functional.jpg",
    "/images/services/tabata.jpg",
    "/images/services/hb.jpg",
    "/images/services/hbh.jpg",
    "/images/services/pilates.jpg",
    "/images/services/sp.jpg",
    "/images/services/fs.jpg",
    "/images/services/trx.jpg",
  ];

  return (
    <>
      <InfoImage
        header={t("services.header_classes")}
        items={trainings}
        images={classImgs}
      />
      <InfoSection
        header={t("services.header_trainings")}
        items={classes}
        images={trainingImgs}
      />
    </>
  );
}
