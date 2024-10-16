import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchInput from "../../../components/Elements/Search/Search";
import "./UserList.scss";
import { userService } from "../../../services/userService";
import Selector from "../../../components/Elements/Selector";
import classNames from "classnames";
import { User } from "../../../types/User";

export default function UserList() {
  const [data, setData] = useState<User[]>([]);
  const [userType, setUserType] = useState<"client" | "trainer">("client");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    userService.getAll().then(setData);
  }, []);

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
      return abonementsLength ? "Active" : "Inactive";
    } else if (userType === "trainer") {
      return trainingsLength ? "Active" : "Inactive";
    }
    return "Unknown";
  };

  return (
    <div className="users">
      <div className="users__header">
        <div className="users__info items-center justify-around flex-1">
          <div className="flex">
            <p>Total:</p> <p>{users.length}</p>
          </div>
          <Selector
            selection={userType}
            handleSelection={() =>
              setUserType((prev) => (prev === "client" ? "trainer" : "client"))
            }
            buttonNames={["client", "trainer"]}
          />
        </div>
        <div className="flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
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
                    status: status === "Active",
                    "status--gray": status === "Inactive",
                  })}
                >
                  {status}
                </div>
              </div>
              <div className="users__content">
                <div className="users__data">
                  <p>Phone</p>
                  <p>{phone}</p>
                </div>
                <div className="users__data">
                  <p>Mail</p>
                  <p>{email}</p>
                </div>
                {userType === "client" && (
                  <div className="users__data">
                    <p>Abonement</p>
                    <p>{abonements?.length}</p>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
