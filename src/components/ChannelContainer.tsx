import React, { Dispatch } from "react";
import { Channel, MessageTeam } from "stream-chat-react";

import { ChannelInner, CreateChannel, EditChannel } from "./";

const ChannelContainer = ({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}: {
  isCreating: boolean;
  setIsCreating: Dispatch<boolean>;
  isEditing: boolean;
  setIsEditing: Dispatch<boolean>;
  createType: any;
}) => {
  if (isCreating)
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    );

  if (isEditing)
    return (
      <div className="channel__container">
        <EditChannel
          setIsCreating={setIsCreating}
          setIsEditing={setIsEditing}
        />
      </div>
    );

  const EmptyState = () => (
    <div className="channel-empty__container">
      <p className="channel-empty__first">
        This is the beginning of your chat history
      </p>
      <p className="channel-empty__second">
        Send messages. attachments, links, emojis, and more!
      </p>
    </div>
  );
  return (
    <div className="channel__container">
      <Channel
        EmptyStateIndicator={EmptyState}
        Message={(messageProps, index) => (
          <MessageTeam key={index} {...messageProps} />
        )}
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
};

export default ChannelContainer;
