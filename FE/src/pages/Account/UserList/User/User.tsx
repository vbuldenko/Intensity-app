import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Modal from "../../../../components/Elements/Modal";
import Purchases from "../../Purchases";
import ClientOverview from "../../Overview/Client/ClientOverview";
import { userService } from "../../../../services/userService";
import TrainerOverview from "../../Overview/Trainer/TrainerOverview";
import { User as UserType } from "../../../../types/User";
import { useTranslation } from "react-i18next";
import Loader from "../../../../components/Elements/Loader";

export default function User() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    userService.getOneById(id as string).then((userData) => {
      setUser(userData);
      setLoading(false); // Set loading to false after data is fetched
    });
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    user && (
      <div className="flex flex-col gap-4">
        <button
          onClick={handleBackClick}
          className="flex gap-2 items-center justify-between"
        >
          <div className="flex gap-2 small-card-element px-6 py-1 text-teal-500 bg-teal-100">
            <ArrowLeftIcon className="w-4" />
          </div>
          <p className="status">
            {user.firstName} {user.lastName}
          </p>
        </button>
        {user.role === "client" ? (
          <div className="flex flex-col gap-4">
            <Modal
              btnName={t("adminDashboard.addAbonement")}
              data={<Purchases clientId={user.id} />}
            />
            <ClientOverview abonements={user.abonements} />
          </div>
        ) : (
          <TrainerOverview user={user} />
        )}
      </div>
    )
  );
}
