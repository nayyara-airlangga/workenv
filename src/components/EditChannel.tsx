import React, { ChangeEvent, Dispatch, useState } from "react";
import { useChatContext } from "stream-chat-react";

import { UserList } from "./";
import { CloseCreateChannel } from "../assets";

const ChannelNameInput = ({
  channelName = "",
  setChannelName,
}: {
  channelName: string;
  setChannelName: Dispatch<string>;
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setChannelName(event.target.value);
  };
  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input
        type="text"
        value={channelName}
        onChange={handleChange}
        placeholder="channel-name"
      />
      <p>Add Members</p>
    </div>
  );
};

const EditChannel = ({
  setIsEditing,
  setIsCreating,
}: {
  setIsCreating: Dispatch<boolean>;
  setIsEditing: Dispatch<boolean>;
}) => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([] as string[]);

  const updateChannel = async (event: any) => {
    event.preventDefault();

    const nameChanged =
      channelName !== (channel?.data?.name || (channel?.data?.id as string));

    if (nameChanged)
      await channel?.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );

    if (selectedUsers.length) await channel?.addMembers(selectedUsers);

    setChannelName(undefined);
    setIsEditing(false);
    setIsCreating(false);
    setSelectedUsers([]);
  };

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit Channel</p>
        <CloseCreateChannel
          setIsEditing={setIsEditing}
          setIsCreating={setIsCreating}
        />
      </div>
      <ChannelNameInput
        setChannelName={setChannelName}
        channelName={channelName as string}
      />
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className="edit-channel__button-wrapper" onClick={updateChannel}>
        <p>Save Changes</p>
      </div>
    </div>
  );
};

export default EditChannel;
