import React, { Dispatch, MouseEventHandler, useState } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import { Channel } from "stream-chat";
import Cookies from "universal-cookie";

import { ChannelSearch, GroupChannelList, GroupChannelPreview } from "./";
import OfficeIcon from "../assets/building.png";
import LogoutIcon from "../assets/logout.png";

const cookies = new Cookies();

const SideBar = ({ logout }: { logout: MouseEventHandler }) => (
  <div className="channel-list__sidebar">
    <div className="channel-list__sidebar__icon1">
      <div className="icon1__inner">
        <img src={OfficeIcon} alt="Hospital" width={30} />
      </div>
    </div>
    <div className="channel-list__sidebar__icon2">
      <div className="icon2__inner">
        <img onClick={logout} src={LogoutIcon} alt="Logout" width={30} />
      </div>
    </div>
  </div>
);

const AppHeader = () => (
  <div className="channel-list__header">
    <p className="channel-list__header__text">WorkEnv</p>
  </div>
);

const customChannelTeamFilter = (channels: Channel[]) =>
  channels.filter((channel) => channel.type === "team");

const customChannelMessagingFilter = (channels: Channel[]) =>
  channels.filter((channel) => channel.type === "messaging");

const ChannelListContent = ({
  setIsCreating,
  isCreating,
  setIsEditing,
  setCreateType,
  setToggleContainer,
}: {
  setIsCreating: Dispatch<boolean>;
  isCreating: boolean;
  setIsEditing: Dispatch<boolean>;
  setCreateType: Dispatch<any>;
  setToggleContainer: Dispatch<(value: boolean) => boolean>;
}) => {
  const { client } = useChatContext();

  const logout = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    cookies.remove("fullName");
    cookies.remove("avatarURL");
    cookies.remove("hashedPassword");
    cookies.remove("phoneNumber");

    window.location.reload();
  };

  const filters: any = { members: { $in: [client.userID] } };

  return (
    <>
      <SideBar logout={logout} />
      <div className="channel-list__list__wrapper">
        <AppHeader />
        <ChannelSearch setToggleContainer={setToggleContainer} />
        <div className="channel-list__list__scroll">
          <ChannelList
            filters={filters}
            channelRenderFilterFn={customChannelTeamFilter}
            List={(listProps) => (
              <GroupChannelList
                {...listProps}
                children={listProps.children}
                isError={false}
                isLoading={false}
                setIsCreating={setIsCreating}
                isCreating={isCreating}
                setIsEditing={setIsEditing}
                setCreateType={setCreateType}
                setToggleContainer={setToggleContainer}
                type="team"
              />
            )}
            Preview={(previewProps) => (
              <GroupChannelPreview
                {...previewProps}
                type="team"
                setIsCreating={setIsCreating}
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
              />
            )}
          />
          <ChannelList
            filters={filters}
            channelRenderFilterFn={customChannelMessagingFilter}
            List={(listProps) => (
              <GroupChannelList
                {...listProps}
                children={listProps.children}
                isError={false}
                isLoading={false}
                setIsCreating={setIsCreating}
                isCreating={isCreating}
                setIsEditing={setIsEditing}
                setCreateType={setCreateType}
                setToggleContainer={setToggleContainer}
                type="messaging"
              />
            )}
            Preview={(previewProps) => (
              <GroupChannelPreview
                {...previewProps}
                type="messaging"
                setIsCreating={setIsCreating}
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

const ChannelListContainer = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
  isCreating,
}: {
  setCreateType: Dispatch<string>;
  setIsCreating: Dispatch<boolean>;
  setIsEditing: Dispatch<boolean>;
  isCreating: boolean;
}) => {
  const [toggleContainer, setToggleContainer] = useState(false);

  return (
    <>
      <div className="channel-list__container">
        <ChannelListContent
          setCreateType={setCreateType}
          setIsCreating={setIsCreating}
          setIsEditing={setIsEditing}
          isCreating={isCreating}
          setToggleContainer={setToggleContainer}
        />
      </div>
      <div
        className="channel-list__container-responsive"
        style={{
          left: toggleContainer ? "0%" : "-89%",
          backgroundColor: "#005fff",
        }}
      >
        <div
          className="channel-list__container-toggle"
          onClick={() =>
            setToggleContainer((prevToggleContainer) => !prevToggleContainer)
          }
        ></div>
        <ChannelListContent
          setCreateType={setCreateType}
          setIsCreating={setIsCreating}
          setIsEditing={setIsEditing}
          isCreating={isCreating}
          setToggleContainer={setToggleContainer}
        />
      </div>
    </>
  );
};

export default ChannelListContainer;
