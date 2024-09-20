import { useState } from "react";
import { Link } from "react-router-dom";
import SearchInput from "../../../components/Elements/Search/Search";
import "./UserList.scss";
import { useAppSelector } from "../../../app/hooks";

interface UserListProps {
  type: "client" | "trainer";
}

export default function UserList({ type }: UserListProps) {
  const users = [];
  // const users = useAppSelector(selectUsers(type));
  // const users = users.filter((user) => user.role === "client");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredUsers = users.filter((client) =>
    client.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="users">
      <div className="users__header">
        <div className="users__info">
          <p>Total:</p> <p>{users.length}</p>
        </div>
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div className="users__list">
        {filteredUsers.map((user) => (
          <Link
            key={user.id}
            to={`${user.id}`}
            className={`users__item card-element`}
          >
            <div className="users__title user-title">
              <p className="users__name section-title">
                {user.firstName} {user.lastName}
              </p>
              <p className="users__status status">Active</p>
            </div>
            <div className="users__data">
              <div className="users__phone">
                <p>Phone</p>
                <p className="user-phone">{user.phone}</p>
              </div>
              <div className="users__email">
                <p>Mail</p>
                <p className="user-email">{user.email}</p>
              </div>
              {type === "client" && (
                <div className="users__abonement">
                  <p>Abonement</p>
                  <p className="user-details">{user.abonements.length}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
