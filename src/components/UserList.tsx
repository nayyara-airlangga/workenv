import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UserResponse } from "stream-chat";
import { Avatar, useChatContext } from "stream-chat-react";
import {
  DefaultUserType,
  DefaultUserTypeInternal,
} from "stream-chat-react/dist/types/types";

import { InviteIcon } from "../assets";

const ListContainer = ({ children }: { children: any }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = ({
  index,
  user,
  setSelectedUsers,
}: {
  index: number;
  user: UserResponse<DefaultUserType<DefaultUserTypeInternal>>;
  setSelectedUsers: Dispatch<SetStateAction<string[]>>;
}) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      setSelectedUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }

    setSelected((prevSelected) => !prevSelected);
  };

  return (
    <div className="user-item__wrapper" onClick={handleSelect}>
      <div className="user-item__name-wrapper">
        <Avatar
          image={user.image}
          name={(user.fullName as string | undefined) || user.id}
          size={32}
        />
        <p className="user-item__name">
          {(user.fullName as string | undefined) || user.id}
        </p>
      </div>
      {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
  );
};

const UserList = ({
  setSelectedUsers,
}: {
  setSelectedUsers: Dispatch<SetStateAction<string[]>>;
}) => {
  const { client } = useChatContext();
  const [users, setUsers]: [
    UserResponse<DefaultUserType<DefaultUserTypeInternal>>[],
    any
  ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const response = await client.queryUsers(
          {
            id: { $ne: client.userID as string },
          },
          { id: 1 },
          { limit: 8 }
        );
        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    if (client) getUsers();
  }, []);

  if (error) {
    return (
      <ListContainer>
        <div className="user-list__message">
          Error loading, please refresh and try again
        </div>
      </ListContainer>
    );
  }
  if (listEmpty) {
    return (
      <ListContainer>
        <div className="user-list__message">
          No users found
        </div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__message">Loading users...</div>
      ) : (
        users?.map((user, index) => (
          <UserItem
            index={index}
            key={user.id}
            user={user}
            setSelectedUsers={setSelectedUsers}
          />
        ))
      )}
    </ListContainer>
  );
};

export default UserList;
