import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Modal from "../../../../components/Elements/Modal";
import Purchases from "../../Purchases";
import ClientOverview from "../../Overview/Client/ClientOverview";
import { userService } from "../../../../services/userService";
import TrainerOverview from "../../Overview/Trainer/TrainerOverview";

export default function User() {
  const { id } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const search = location.state?.search || "";

  useEffect(() => {
    userService.getOneById(id).then(setUser);
  }, []);

  return (
    user && (
      <div className="flex flex-col gap-4">
        <Link to={`..${search}`} relative="path">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 small-card-element px-6 py-1">
              <ArrowLeftIcon className="w-4" />
              <span className="w-max">Back to all</span>
            </div>

            <p className="status">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </Link>
        {user.role === "client" ? (
          <div className="flex flex-col gap-4">
            <Modal
              btnName={"Add new abonement"}
              data={<Purchases clientId={user.id} />}
            />
            <ClientOverview user={user} />
          </div>
        ) : (
          <TrainerOverview user={user} />
        )}
      </div>
    )
  );
}
