import { useState, useMemo } from "react";
import Selector from "../../../../components/Buttons/Selector";
import { filterAbonements, ViewOption } from "../../../../utils/abonement";
import { sortByParam } from "../../../../utils/utils";
import Abonement from "../../../../components/Abonement";
import "./ClientOverview.scss";
import { useTranslation } from "react-i18next";
import { Abonement as AType } from "../../../../types/Abonement";

interface ClientOverviewProps {
  abonements: AType[];
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ abonements }) => {
  const { t } = useTranslation();
  const [abonementView, setAbonementView] = useState<ViewOption>("active");

  const notAALength = useMemo(
    () => filterAbonements(abonements, "inactive").length,
    [abonements]
  );

  const filteredAbonements = useMemo(
    () => filterAbonements(abonements, abonementView),
    [abonements, abonementView]
  );

  const sortedAbonements = useMemo(
    () => sortByParam(filteredAbonements, "createdAt"),
    [filteredAbonements]
  );

  const handleViewChange = (view: ViewOption) => {
    setAbonementView(view);
  };

  const buttonNames = [
    { value: "active", label: t("abonement.active") },
    { value: "expired", label: t("abonement.expired") },
    { value: "inactive", label: t("abonement.inactive") },
  ];

  return (
    <div className="client-overview relative">
      <Selector
        selection={abonementView}
        handleSelection={handleViewChange}
        buttonNames={buttonNames}
      />
      {notAALength > 0 && <div className="counter">{notAALength}</div>}
      <div className="client-overview__content">
        {sortedAbonements.length ? (
          sortedAbonements.map((abonement) => (
            <Abonement key={abonement.id} abonement={abonement} />
          ))
        ) : (
          <p className="text-center mt-8 text-gray-500">
            {t("clientOverview.noAbonements")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClientOverview;
