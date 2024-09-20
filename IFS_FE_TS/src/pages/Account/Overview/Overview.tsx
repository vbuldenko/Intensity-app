// import Admin from './Admin/Admin';
// import TrainerOverview from './Trainer/TrainerOverview';
// import ClientOverview from './Client/ClientOverview';
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import AdminDashboard from "./Admin/AdminOverview";
import ClientOverview from "./Client/ClientOverview";
import "./Overview.scss";

export default function Overview() {
  const { data: user, loading, error } = useAppSelector(selectUser);

  return (
    user && (
      <div className="overview">
        <div className="overview__header">
          <div>
            <h3>
              Welcome back, <b>{user.firstName}</b>
            </h3>
          </div>
          <span className="status">{user.role}</span>
        </div>

        <div className="overview__body">
          {user.role === "admin" ? (
            <AdminDashboard />
          ) : (
            // user.role === "trainer" ? (
            // <TrainerOverview />
            // ) :

            <ClientOverview abonements={user.abonements} />
          )}
        </div>
      </div>
    )
  );
}
