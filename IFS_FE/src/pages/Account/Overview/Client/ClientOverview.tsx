import { useEffect, useState } from "react";

import Selector from "../../../../components/Elements/Selector";
import { filterAbonements, ViewOption } from "../../../../utils/abonement";
import { sortByParam } from "../../../../utils/utils";
import Abonement from "../../../../components/Abonement";
import "./ClientOverview.scss";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectAbonements } from "../../../../features/abonements/abonementSlice";
import { fetchAbonements } from "../../../../features/abonements/abonementThunk";

export default function ClientOverview() {
  const abonements = useAppSelector(selectAbonements);
  const [abonementView, setAbonementView] = useState<ViewOption>("active");
  const dispatch = useAppDispatch();
  const filteredAbonements = abonements
    ? filterAbonements(abonements, abonementView)
    : [];

  const handleViewChange = (view: ViewOption) => {
    setAbonementView(view);
  };

  useEffect(() => {
    if (!abonements) {
      dispatch(fetchAbonements());
    }
  }, [dispatch]);

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
