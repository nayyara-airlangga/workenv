import React, { Dispatch } from "react";
import { Channel, User } from "stream-chat";
import { Avatar, useChatContext } from "stream-chat-react";

const channelByUser = async ({
  client,
  setActiveChannel,
  channel,
  setChannel,
}: {
  client: any;
  channel: Channel;
  setChannel: Function;
  setActiveChannel: Dispatch<Channel>;
}) => {
  const filters = {
    type: "messaging",
    member_count: 2,
    members: { $eq: [client.user.id, client.userID] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) return setActiveChannel(existingChannel);

  const newChannel = client.channel("messaging", {
    members: [channel.id, client.userID],
  });

  setChannel(newChannel);

  return setActiveChannel(newChannel);
};

const SearchResult = ({
  channel,
  focusedId,
  type,
  setChannel,
  setToggleContainer,
}: {
  channel: any;
  focusedId: string;
  type: string;
  setChannel: Function;
  setToggleContainer: Dispatch<(value: boolean) => boolean>;
}) => {
  const { client, setActiveChannel } = useChatContext();

  if (type === "channel") {
    return (
      <div
        onClick={() => {
          setChannel(channel);
          if (setToggleContainer) {
            setToggleContainer((prevState) => !prevState);
          }
        }}
        className={
          focusedId === channel.id
            ? "channel-search__result-container__focused"
            : "channel-search__result-container"
        }
      >
        <div className="result-hashtag">#</div>
        <p className="channel-search__result-text">{channel?.data?.name}</p>
      </div>
    );
  }

  return (
    <div
      onClick={async () => {
        channelByUser({ client, setActiveChannel, channel, setChannel });
        if (setToggleContainer) {
          setToggleContainer((prevState) => !prevState);
        }
      }}
      className={
        focusedId === channel.id
          ? "channel-search__result-container__focused"
          : "channel-search__result-container"
      }
    >
      <div className="channel-search__result-user">
        <Avatar
          image={channel?.image || undefined}
          name={channel?.name}
          size={24}
        />
        <p className="channel-search__result-text">{channel?.fullName}</p>
      </div>
    </div>
  );
};

const ResultsDropdown = ({
  groupChannels,
  directChannels,
  focusedId,
  loading,
  setChannel,
  setToggleContainer,
}: {
  groupChannels: Channel[];
  directChannels: User[];
  focusedId: string;
  loading: boolean;
  setChannel: Function;
  setToggleContainer: Dispatch<(value: boolean) => boolean>;
}) => {
  return (
    <div className="channel-search__results">
      <p className="channel-search__results-header">Channels</p>
      {loading && !groupChannels.length && (
        <p className="channel-search__results-header">
          <i>Loading...</i>
        </p>
      )}
      {!loading && !groupChannels.length ? (
        <p className="channel-search__results-header">
          <i>No channels found</i>
        </p>
      ) : (
        groupChannels?.map((channel: Channel, index: number) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={index}
            setChannel={setChannel}
            type="channel"
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
      <p className="channel-search__results-header">Users</p>
      {loading && !directChannels.length && (
        <p className="channel-search__results-header">
          <i>Loading...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className="channel-search__res ults-header">
          <i>No direct messages found</i>
        </p>
      ) : (
        directChannels?.map((channel: User, index: number) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={index}
            setChannel={setChannel}
            type="user"
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
    </div>
  );
};

export default ResultsDropdown;
