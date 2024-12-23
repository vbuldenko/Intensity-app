import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "../../../components/Elements/Search/Search";
import "./UserList.scss";
import { userService } from "../../../services/userService";
import Selector from "../../../components/Elements/Selector";
import classNames from "classnames";
import { User } from "../../../types/User";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Elements/Loader"; // Import the Loader component

export default function UserList() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialUserType = queryParams.get("userType") || "client";
  const initialSearchQuery = queryParams.get("searchQuery") || "";

  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [userType, setUserType] = useState<"client" | "trainer">(
    initialUserType as "client" | "trainer"
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  useEffect(() => {
    userService.getAll().then((users) => {
      setData(users);
      setLoading(false); // Set loading to false after data is fetched
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("userType", userType);
    if (searchQuery) {
      params.set("searchQuery", searchQuery);
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [userType, searchQuery]);

  const users = useMemo(
    () => data.filter((user) => user.role === userType),
    [data, userType]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((client) =>
        client.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  const getStatus = (
    userType: "client" | "trainer",
    abonementsLength: number = 0,
    trainingsLength: number = 0
  ): string => {
    if (userType === "client") {
      return abonementsLength ? t("userList.active") : t("userList.inactive");
    } else if (userType === "trainer") {
      return trainingsLength ? t("userList.active") : t("userList.inactive");
    }
    return t("userList.unknown");
  };

  const buttonNames = [
    { value: "client", label: t("userList.client") },
    { value: "trainer", label: t("userList.trainer") },
  ];

  return (
    <div className="users">
      <div className="users__header">
        <div className="users__info items-center justify-around flex-1">
          <div className="flex">
            <p>{t("userList.total")}:</p> <p>{users.length}</p>
          </div>
          <Selector
            selection={userType}
            handleSelection={() =>
              setUserType((prev) => (prev === "client" ? "trainer" : "client"))
            }
            buttonNames={buttonNames}
          />
        </div>
        <div className="flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
      {loading ? ( // Conditionally render the loader spinner
        <Loader />
      ) : (
        <div className="users__list">
          {filteredUsers.map((user) => {
            const {
              id,
              firstName,
              lastName,
              phone,
              email,
              abonements,
              trainings,
            } = user;
            const status = getStatus(
              userType,
              abonements?.length,
              trainings?.length
            );

            return (
              <Link key={id} to={`${id}`} className="users__item card-element">
                <div className="users__title">
                  <p className="users__name">
                    {firstName} {lastName}
                  </p>

                  <div
                    className={classNames("status", {
                      status: status === t("userList.active"),
                      "status--gray": status === t("userList.inactive"),
                    })}
                  >
                    {status}
                  </div>
                </div>
                <div className="users__content">
                  <div className="users__data items-center">
                    <p>ID</p>
                    <p className="bg-teal-100 text-teal-600 px-2 py-1 rounded-md">
                      {id}
                    </p>
                  </div>
                  <div className="users__data">
                    <p>{t("userList.phone")}</p>
                    <p className="px-2 py-1">{phone}</p>
                  </div>
                  <div className="users__data">
                    <p>{t("userList.email")}</p>
                    <p className="px-2 py-1">{email}</p>
                  </div>
                  {userType === "client" && (
                    <div className="users__data">
                      <p>{t("userList.abonement")}</p>
                      <p className="px-2 py-1">{abonements?.length}</p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
