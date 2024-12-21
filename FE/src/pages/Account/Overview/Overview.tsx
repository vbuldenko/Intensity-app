import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../app/features/user/userSlice";
import AdminDashboard from "./Admin";
import ClientOverview from "./Client";
import TrainerOverview from "./Trainer";
import "./Overview.scss";
import Loader from "../../../components/Elements/Loader";
import { selectAbonements } from "../../../app/features/abonements/abonementSlice";
import { useEffect } from "react";
import { fetchAbonements } from "../../../app/features/abonements/abonementThunk";

export default function Overview() {
  const { data: user, loading, error } = useAppSelector(selectUser);
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <p className="auth__error-message self-center card-element bg-red-100">
        {error}
      </p>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="overview">
      <div className="overview__body">
        {user.role === "admin" && <AdminDashboard />}
        {user.role === "trainer" && <TrainerOverview user={user} />}
        {user.role === "client" && (
          <ClientOverview abonements={abonements || []} />
        )}
      </div>
    </div>
  );
}
