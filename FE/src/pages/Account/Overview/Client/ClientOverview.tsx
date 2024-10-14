import { useState } from "react";
import Selector from "../../../../components/Elements/Selector";
import { filterAbonements, ViewOption } from "../../../../utils/abonement";
import { sortByParam } from "../../../../utils/utils";
import Abonement from "../../../../components/Abonement";
import "./ClientOverview.scss";

export default function ClientOverview({ user }) {
  const abonements = user?.abonements;
  const [abonementView, setAbonementView] = useState<ViewOption>("active");
  const filteredAbonements = abonements
    ? filterAbonements(abonements, abonementView)
    : [];

  const handleViewChange = (view: ViewOption) => {
    setAbonementView(view);
  };

  return (
    <div className="client-overview">
      <Selector
        selection={abonementView}
        handleSelection={handleViewChange}
        buttonNames={["active", "expired", "not activated"]}
      />
      <div className="client-overview__content">
        {sortByParam(filteredAbonements, "createdAt").map((abonement) => {
          return <Abonement key={abonement.id} abonement={abonement} />;
        })}
      </div>
    </div>
  );
}
