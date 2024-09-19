// import Admin from './Admin/Admin';
// import TrainerOverview from './Trainer/TrainerOverview';
// import ClientOverview from './Client/ClientOverview';
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
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
          {/* {role === "admin" ? (
          <Admin />
        ) : role === "trainer" ? (
          <TrainerOverview />
        ) : (
          <ClientOverview abonements={abonements} />
        )} */}
        </div>
      </div>
    )
  );
}
