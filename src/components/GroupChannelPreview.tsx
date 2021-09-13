import React, { Dispatch } from "react";
import { Channel } from "stream-chat";
import { Avatar, useChatContext } from "stream-chat-react";

const GroupChannelPreview = ({
  channel,
  type,
  setToggleContainer,
  setIsCreating,
  setIsEditing,
}: {
  channel: Channel;
  type: string;
  setToggleContainer: Dispatch<(value: boolean) => boolean>;
  setIsCreating: Dispatch<boolean>;
  setIsEditing: Dispatch<boolean>;
}) => {
  const { channel: activeChannel, client, setActiveChannel } = useChatContext();

  const ChannelPreview = () => (
    <p className="channel-preview__item">
      # {channel?.data?.name || channel?.data?.id}
    </p>
  );

  const DirectPreview = () => {
    const members = Object.values(channel?.state.members).filter(
      ({ user }) => user?.id !== client.userID
    );

    return (
      <div className="channel-preview__item single">
        <Avatar
          image={members[0]?.user?.image as string}
          name={members[0]?.user?.name as string}
          size={24}
        />
        <p>{(members[0]?.user?.fullName as string) || members[0]?.user?.id}</p>
      </div>
    );
  };

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? "channel-preview__wrapper__selected"
          : "channel-preview__wrapper"
      }
      onClick={() => {
        setIsCreating(false);
        setIsEditing(false);
        setActiveChannel(channel);

        if (setToggleContainer) setToggleContainer((prevState) => !prevState);
      }}
    >
      {type === "team" ? <ChannelPreview /> : <DirectPreview />}
    </div>
  );
};

export default GroupChannelPreview;
