import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import AdminDashboard from "./Admin";
import ClientOverview from "./Client";
import TrainerOverview from "./Trainer";
import "./Overview.scss";
import Loader from "../../../components/Elements/Loader";

export default function Overview() {
  const { data: user, loading, error } = useAppSelector(selectUser);

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
      <div className="overview__header">
        <div>
          <p>
            Welcome back, <b className="capitalize">{user.firstName}</b>
          </p>
        </div>
        <span className="status">{user.role}</span>
      </div>

      <div className="overview__body">
        {user.role === "admin" && <AdminDashboard />}
        {user.role === "trainer" && <TrainerOverview user={user} />}
        {user.role === "client" && <ClientOverview />}
      </div>
    </div>
  );
}
