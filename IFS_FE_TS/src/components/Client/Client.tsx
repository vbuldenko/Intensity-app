import { useParams, Link, useLocation } from "react-router-dom";
import ModalComponent from "../../Elements/ModalComponent";
import Purchases from "../Client/Purchases";
import { useAppSelector } from "../../app/hooks";
import ClientOverview from "../../pages/Account/Overview/Client/ClientOverview";

export default function Client() {
  const { id } = useParams();
  const location = useLocation();
  // const client = useAppSelector(({ user }) =>
  //   user.userList.find((client) => client.id === id.toString())
  // );

  if (!client) {
    return null;
  }
  const search = location.state?.search || "";

  function handleClick() {
    console.log("add abonement");
  }

  return (
    <div className="cfa-container">
      <Link to={`..${search}`} relative="path" className="back-button">
        <div className="flex-row-container">
          <p>
            &larr; <span>Back to all</span>
          </p>

          <p className="status">
            {client.firstName} {client.lastName}
          </p>
        </div>
      </Link>
      <div className="flex-column">
        <ModalComponent
          btnName={"Add new Abonement"}
          data={<Purchases clientId={client.id} />}
        />
        <ClientOverview abonements={client.abonements} />
      </div>
    </div>
  );
}
