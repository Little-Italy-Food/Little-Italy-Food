import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RightSide.css";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import TrendCard from "../TrendCard/TrendCard";
import ShareModal from "../ShareModal/ShareModal";

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [activeIcon, setActiveIcon] = useState("home"); // Track active icon
  const navigate = useNavigate();

  const handleIconClick = (icon) => {
    setActiveIcon(icon);
    switch (icon) {
      case "home":
        navigate("/home");
        break;
      case "settings":
        navigate("/profile");
        break;
      // Handle other cases if needed
      default:
        break;
    }
  };

  return (
    <div className="RightSide">
      <div className="navIcons">
        <img
          src={Home}
          alt="Home"
          className={activeIcon === "home" ? "active" : ""}
          onClick={() => handleIconClick("home")}
        />
        <div
          className={activeIcon === "settings" ? "icon active" : "icon"}
          onClick={() => handleIconClick("settings")}
        >
          <UilSetting />
        </div>
        <img
          src={Noti}
          alt="Notifications"
          className={activeIcon === "notifications" ? "active" : ""}
          onClick={() => setActiveIcon("notifications")}
        />
        <img
          src={Comment}
          alt="Comments"
          className={activeIcon === "comments" ? "active" : ""}
          onClick={() => setActiveIcon("comments")}
        />
      </div>

      <TrendCard />

      <button className="button r-button" onClick={() => setModalOpened(true)}>
        Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
    </div>
  );
};

export default RightSide;
