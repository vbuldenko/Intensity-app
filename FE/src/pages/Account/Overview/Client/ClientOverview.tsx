import { useState, useMemo } from "react";
import Selector from "../../../../components/Elements/Selector";
import { filterAbonements, ViewOption } from "../../../../utils/abonement";
import { sortByParam } from "../../../../utils/utils";
import Abonement from "../../../../components/Abonement";
import "./ClientOverview.scss";
import { User } from "../../../../types/User";
import { useTranslation } from "react-i18next";

interface ClientOverviewProps {
  user: User;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ user }) => {
  const { t } = useTranslation();
  const [abonementView, setAbonementView] = useState<ViewOption>("active");

  const abonements = user?.abonements || [];

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
    <div className="client-overview">
      <Selector
        selection={abonementView}
        handleSelection={handleViewChange}
        buttonNames={buttonNames}
      />
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
