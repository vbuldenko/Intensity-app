import React, { useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../app/features/user/userSlice";
import { selectAbonements } from "../../../app/features/abonements/abonementSlice";
import AdminDashboard from "./Admin";
import ClientOverview from "./Client";
import TrainerOverview from "./Trainer";
import Loader from "../../../components/Elements/Loader";
import "./Overview.scss";

const Overview: React.FC = () => {
  const { data, loading } = useAppSelector(selectUser);
  const abonements = useAppSelector(selectAbonements);

  const renderDashboard = useMemo(() => {
    if (!data) return null;

    switch (data.role) {
      case "admin":
        return <AdminDashboard />;
      case "trainer":
        return <TrainerOverview user={data} />;
      case "client":
        return <ClientOverview abonements={abonements || []} />;
      default:
        return null;
    }
  }, [data, abonements]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="overview">
      <div className="overview__body">{renderDashboard}</div>
    </div>
  );
};

export default Overview;
