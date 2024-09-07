import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RightSide.css";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import TrendCard from "../TrendCard/TrendCard";
import ShareModal from "../ShareModal/ShareModal";
import ChefMentionModal from "./ChefMentionModal";
import CommentModal from "./CommentModal"; // Import CommentModal component

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [chefMentionModalOpened, setChefMentionModalOpened] = useState(false);
  const [commentModalOpened, setCommentModalOpened] = useState(false); // New state for comment modal
  const [chefMentions, setChefMentions] = useState(null);
  const [comments, setComments] = useState([]); // New state for comments
  const [activeIcon, setActiveIcon] = useState("home");
  const [chefMentionCount, setChefMentionCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0); // New state for comment count
  const [fullResponse, setFullResponse] = useState(null);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchChefMentions();
    fetchComments();
  }, []);

  const fetchChefMentions = async () => {
    const id = localStorage.getItem("userId");
    if (id) {
      try {
        const response = await axios.get(
          `http://localhost:5001/posts/chef-mention/${id}`
        );
        const posts = response.data.posts;
        setFullResponse(response.data);
        if (posts.length > 0 && posts[0].chefMentions) {
          const chefMentions = posts[0].chefMentions;
          setChefMentions(chefMentions);
          setChefMentionCount(chefMentions.length);
          console.log("Chef Mention Count:", chefMentions.length);
        } else {
          setChefMentionCount(0);
        }
      } catch (error) {
        console.error("Error fetching chef mentions:", error);
      }
    } else {
      console.error("Chef mention ID not found in local storage.");
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5001/posts/sentToMe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        setPosts(response.data.posts); // Set posts data
        setCommentCount(response.data.posts.length); // Update comment count
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleIconClick = (icon) => {
    setActiveIcon(icon);
    switch (icon) {
      case "home":
        navigate("/home");
        break;
      case "settings":
        navigate("/profile");
        break;
      case "notifications":
        fetchChefMentions(); // Ensure the chef mentions are up-to-date
        setChefMentionModalOpened(true); // Open chef mention modal
        break;
      case "comments":
        fetchComments(); // Ensure fetchComments is called to get the latest data
        setCommentModalOpened(true); // Open comment modal
        break;
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
          style={{ marginTop: "10px" }}
        >
          <UilSetting />
        </div>
        <div className="notification-icon">
          <img
            src={Noti}
            alt="Notifications"
            className={activeIcon === "notifications" ? "active" : ""}
            onClick={() => handleIconClick("notifications")}
          />
          {chefMentionCount > 0 && (
            <span className="notification-badge">{chefMentionCount}</span>
          )}
        </div>
        <img
          src={Comment}
          alt="Comments"
          className={activeIcon === "comments" ? "active" : ""}
          onClick={() => handleIconClick("comments")}
        />
        {commentCount > 0 && (
          <span className="notification-badge">{commentCount}</span>
        )}
      </div>

      <TrendCard />

      <button className="button r-button" onClick={() => setModalOpened(true)}>
        Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />

      {/* Chef Mention Modal */}
      <ChefMentionModal
        modalOpened={chefMentionModalOpened}
        setModalOpened={setChefMentionModalOpened}
        chefMentions={chefMentions}
        fullResponse={fullResponse}
      />

      {/* Comment Modal */}
      <CommentModal
        modalOpened={commentModalOpened}
        setModalOpened={setCommentModalOpened}
        posts={posts}
      />
    </div>
  );
};

export default RightSide;
