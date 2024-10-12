import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchInput from "../../../components/Elements/Search/Search";
import "./UserList.scss";
import { userService } from "../../../services/userService";
import Selector from "../../../components/Elements/Selector";

export default function UserList() {
  const [data, setUsers] = useState([]);
  const [userType, setUserType] = useState("client");
  const users = data.filter((user) => user.role === userType);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredUsers = users.filter((client) =>
    client.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    userService.getAll().then(setUsers);
  }, []);

  const getStatus = (
    userType: string,
    abonementsLength: number,
    trainingsLength: number
  ) => {
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
        {filteredUsers.map((user) => (
          <Link
            key={user.id}
            to={`${user.id}`}
            className="users__item card-element"
          >
            <div className="users__title">
              <p className="users__name">
                {user.firstName} {user.lastName}
              </p>
              <p className="users__status status">
                {getStatus(
                  userType,
                  user.abonements?.length,
                  user.trainings?.length
                )}
              </p>
            </div>
            <div className="users__content">
              <div className="users__data">
                <p>Phone</p>
                <p>{user.phone}</p>
              </div>
              <div className="users__data">
                <p>Mail</p>
                <p>{user.email}</p>
              </div>
              {userType === "client" && (
                <div className="users__data">
                  <p>Abonement</p>
                  <p>{user.abonements.length}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
