import { data } from "../../assets/servicesData";
import InfoSection from "../../components/InfoSection/InfoSection";
import "./Services.scss";

export default function ServicesPage() {
  return (
    <>
      <InfoSection header="Наші послуги" items={data.trainings} />
      <InfoSection header="Напрямки тренувань" items={data.classes} />
    </>
  );
}
