import React, { useState, useEffect, ChangeEvent, Dispatch } from "react";
import { Channel, RequireOnlyOne, User } from "stream-chat";
import { useChatContext } from "stream-chat-react";

import { SearchIcon } from "../assets";
import { ResultsDropdown } from ".";

const ChannelSearch = ({
  setToggleContainer,
}: {
  setToggleContainer: Dispatch<(value: boolean) => boolean>;
}) => {
  const { client, setActiveChannel } = useChatContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupChannels, setGroupChannels] = useState([] as Channel[]);
  const [directChannels, setDirectChannels] = useState([] as User[]);

  useEffect(() => {
    if (!query) {
      setGroupChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  const getChannels = async (text: string) => {
    try {
      const channelResponse = client.queryChannels({
        type: "team",
        name: { $autocomplete: text },
        members: { $in: [client.userID] } as RequireOnlyOne<"$in">,
      });

      const userResponse = client.queryUsers({
        id: { $ne: client.userID as string },
        name: { $autocomplete: text },
      });

      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      if (channels.length) {
        setGroupChannels(channels);
        console.log(channels);
      }
      if (users.length) {
        setDirectChannels(users as []);
        console.log(users);
      }
    } catch (error) {
      setQuery("");
    }
  };

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setLoading(true);
    setQuery(event.target.value);
    getChannels(event.target.value);
  };

  const setChannel = (channel: Channel) => {
    setQuery("");
    setActiveChannel(channel);
  };
  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          className="channel-search__input__text"
          placeholder="Search"
          value={query}
          onChange={onSearch}
        />
      </div>
      {query && (
        <ResultsDropdown
          groupChannels={groupChannels}
          directChannels={directChannels}
          loading={loading}
          setChannel={setChannel}
          focusedId={""}
          setToggleContainer={setToggleContainer}
        />
      )}
    </div>
  );
};

export default ChannelSearch;
