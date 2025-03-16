import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
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

interface ClientContextType {
  client: UserType | null;
  setClient: Dispatch<SetStateAction<UserType | null>>;
  refreshClient: () => Promise<void>;
}

export const ClientContext = createContext<ClientContextType | undefined>(
  undefined
);

export function useClientContext() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export default function User() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updated, setUpdated] = useState<boolean>(false);

  const refreshUser = async () => {
    if (id) {
      try {
        setLoading(true);
        const userData = await userService.getOneById(id);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshUser();
  }, [id, updated]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader />;
  }

  const contextValue: ClientContextType = {
    client: user,
    setClient: setUser,
    refreshClient: refreshUser,
  };

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
          <p className="text-pink-700">
            {user.firstName} {user.lastName}
          </p>
        </button>
        {user.role === "client" ? (
          <div className="flex flex-col gap-4">
            <Modal
              btnName={t("adminDashboard.addAbonement")}
              data={
                <Purchases
                  clientId={user.id}
                  updater={() => setUpdated(true)}
                />
              }
            />
            <ClientContext value={contextValue}>
              <ClientOverview abonements={user.abonements} />
            </ClientContext>
          </div>
        ) : (
          <TrainerOverview user={user} />
        )}
      </div>
    )
  );
}
