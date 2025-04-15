import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "../../../components/Elements/Search/Search";
import "./UserList.scss";
import Selector from "../../../components/Buttons/Selector";
import classNames from "classnames";
import { User } from "../../../types/User";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Elements/Loader";
import ScrollToTopButton from "../../../components/Buttons/ScrollToTopButton/ScrollToTopButton";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchClients,
  selectClients,
} from "../../../app/features/users/clientSlice";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

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
    <div key={id} className="users__item card-element relative">
      <Link to={`${id}`} className="users__title">
        <p className="users__name">
          {firstName} {lastName}
        </p>
        <div
          className={classNames(
            "status status--right-border absolute top-0 right-0",
            {
              "status--green": status === t("userList.active"),
              "status--gray": status === t("userList.inactive"),
            }
          )}
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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(selectClients);
  const { userType, setUserType, searchQuery, setSearchQuery } =
    useQueryParams();

  const users = useMemo(
    () => data.filter((user) => user.role === userType),
    [data, userType]
  );

  useEffect(() => {
    if (data.length === 0) {
      dispatch(fetchClients());
    }
  }, [dispatch, data.length]);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  // Paginate users only if no search query is present
  const paginatedUsers = useMemo(() => {
    if (searchQuery) {
      return filteredUsers; // Show all filtered users if searchQuery is present
    }
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, usersPerPage, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
        <>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mb-2">
            <button
              className="bg-teal-500 text-white px-2 py-2 rounded-md"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeftIcon className="menu__icon" />
            </button>
            <span className="text-gray-400">
              {currentPage} of {totalPages}
            </span>
            <button
              className="bg-teal-500 text-white px-2 py-2 rounded-md"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRightIcon className="menu__icon" />
            </button>
          </div>

          <div className="users__list">
            {paginatedUsers.map((user) => (
              <UserListItem key={user.id} user={user} userType={userType} />
            ))}
          </div>
        </>
      )}

      <ScrollToTopButton />
    </div>
  );
}
