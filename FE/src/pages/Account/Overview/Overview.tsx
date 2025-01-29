import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../app/features/user/userSlice";
import { selectAbonements } from "../../../app/features/abonements/abonementSlice";
import { fetchAbonements } from "../../../app/features/abonements/abonementThunk";
import AdminDashboard from "./Admin";
import ClientOverview from "./Client";
import TrainerOverview from "./Trainer";
import Loader from "../../../components/Elements/Loader";
import "./Overview.scss";

export default function Overview() {
  const { data: user, loading } = useAppSelector(selectUser);
  const abonements = useAppSelector(selectAbonements);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      user &&
      (user.role === "client" || user.role === "admin") &&
      !abonements
    ) {
      dispatch(fetchAbonements());
    }
  }, [user, dispatch]);

  const renderDashboard = useMemo(() => {
    if (!user) return <div className="error">User not loaded</div>;

    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "trainer":
        return <TrainerOverview user={user} />;
      case "client":
        return <ClientOverview abonements={abonements || []} />;
      default:
        return <div className="error">Unknown role</div>;
    }
  }, [user, abonements]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="overview">
      <div className="overview__body">{renderDashboard}</div>
    </div>
  );
}
