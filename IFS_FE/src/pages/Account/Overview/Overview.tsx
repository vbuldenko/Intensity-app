// import Admin from './Admin/Admin';
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import AdminDashboard from "./Admin";
import ClientOverview from "./Client";
import TrainerData from "./Trainer";
import "./Overview.scss";
import Loader from "../../../components/Elements/Loader";

export default function Overview() {
  const { data: user, loading, error } = useAppSelector(selectUser);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <h1 className="auth__error-message self-center card-element bg-red-100">
        {error}
      </h1>
    );
  }

  return (
    user && (
      <div className="overview">
        <div className="overview__header">
          <div>
            <h3>
              Welcome back, <b className="capitalize">{user.firstName}</b>
            </h3>
          </div>
          <span className="status">{user.role}</span>
        </div>

        <div className="overview__body">
          {user.role === "admin" ? (
            <AdminDashboard />
          ) : user.role === "trainer" ? (
            <TrainerData user={user} />
          ) : (
            <ClientOverview abonements={user.abonements} />
          )}
        </div>
      </div>
    )
  );
}
