import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "../../../components/Elements/Search/Search";
import "./UserList.scss";
import { userService } from "../../../services/userService";
import Selector from "../../../components/Buttons/Selector";
import classNames from "classnames";
import { User } from "../../../types/User";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Elements/Loader";
import ScrollToTopButton from "../../../components/Buttons/ScrollToTopButton/ScrollToTopButton";

const useFetchedUsers = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    userService.getAll().then((users) => {
      setData(users);
      setLoading(false);
    });
  }, []);

  return { data, loading };
};

const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialUserType = queryParams.get("userType") || "client";
  const initialSearchQuery = queryParams.get("searchQuery") || "";

  const [userType, setUserType] = useState<"client" | "trainer">(
    initialUserType as "client" | "trainer"
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("userType", userType);
    if (searchQuery) {
      params.set("searchQuery", searchQuery);
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [userType, searchQuery, navigate]);

  return { userType, setUserType, searchQuery, setSearchQuery };
};

const UserListHeader = ({
  userType,
  setUserType,
  searchQuery,
  setSearchQuery,
  totalUsers,
}: {
  userType: "client" | "trainer";
  setUserType: React.Dispatch<React.SetStateAction<"client" | "trainer">>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  totalUsers: number;
}) => {
  const { t } = useTranslation();
  const buttonNames = [
    { value: "client", label: t("userList.client") },
    { value: "trainer", label: t("userList.trainer") },
  ];

  return (
    <div className="users__header">
      <div className="users__info items-center justify-around flex-1">
        <div className="flex">
          <p>{t("userList.total")}:</p> <p>{totalUsers}</p>
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
  );
};

const UserListItem = ({
  user,
  userType,
}: {
  user: User;
  userType: "client" | "trainer";
}) => {
  const { t } = useTranslation();
  const { id, firstName, lastName, phone, email, abonements, trainings } = user;
  const status = getStatus(userType, abonements?.length, trainings?.length);

  return (
    <div key={id} className="users__item card-element">
      <Link to={`${id}`} className="users__title">
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
      </Link>
      <div className="users__content">
        <div className="users__data items-center">
          <p>ID</p>
          <p className="bg-gray-700 text-amber-500 px-2 py-1 rounded-md">
            {id}
          </p>
        </div>
        <div className="users__data">
          <p>{t("userList.phone")}</p>
          <p>{phone}</p>
        </div>
        <div className="users__data">
          <p>{t("userList.email")}</p>
          <p className="text-green-500">{email}</p>
        </div>
        {userType === "client" && (
          <div className="users__data">
            <p>{t("userList.abonement")}</p>
            <p>{abonements?.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatus = (
  userType: "client" | "trainer",
  abonementsLength: number = 0,
  trainingsLength: number = 0
): string => {
  const { t } = useTranslation();
  if (userType === "client") {
    return abonementsLength ? t("userList.active") : t("userList.inactive");
  } else if (userType === "trainer") {
    return trainingsLength ? t("userList.active") : t("userList.inactive");
  }
  return t("userList.unknown");
};

export default function UserList() {
  const { data, loading } = useFetchedUsers();
  const { userType, setUserType, searchQuery, setSearchQuery } =
    useQueryParams();

  const users = useMemo(
    () => data.filter((user) => user.role === userType),
    [data, userType]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  return (
    <div className="users">
      <UserListHeader
        userType={userType}
        setUserType={setUserType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalUsers={filteredUsers.length}
      />
      {loading ? (
        <Loader />
      ) : (
        <div className="users__list">
          {filteredUsers.map((user) => (
            <UserListItem key={user.id} user={user} userType={userType} />
          ))}
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
}
