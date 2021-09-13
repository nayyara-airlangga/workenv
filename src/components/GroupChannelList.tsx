import React, { Dispatch, ReactNode } from "react";

import { AddChannel } from "../assets";

const GroupChannelList = ({
  children,
  isError = false,
  isLoading,
  type,
  setIsCreating,
  isCreating,
  setIsEditing,
  setCreateType,
  setToggleContainer,
}: {
  children: ReactNode;
  isError: boolean;
  isLoading: boolean;
  type: string;
  setIsCreating: Dispatch<boolean>;
  isCreating: boolean;
  setIsEditing: Dispatch<boolean>;
  setCreateType: Dispatch<string>;
  setToggleContainer: Dispatch<(value: boolean) => boolean>;
}) => {
  if (isError) {
    return type === "team" ? (
      <div className="team-channel-list">
        <p className="team-channel-list__message">
          There seems to be an issue with the connection, please wait a moment
          and try again.
        </p>
      </div>
    ) : null;
  }

  if (isLoading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          Loading {type === "team" ? "Channels..." : "Direct Messages..."}
        </p>
      </div>
    );
  }
  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === "team" ? "Channels" : "Direct Messages"}
        </p>
        <AddChannel
          setIsCreating={setIsCreating}
          isCreating={isCreating}
          setIsEditing={setIsEditing}
          setCreateType={setCreateType}
          type={type === "team" ? "team" : "messaging"}
          setToggleContainer={setToggleContainer}
        />
      </div>
      {children}
    </div>
  );
};

export default GroupChannelList;
