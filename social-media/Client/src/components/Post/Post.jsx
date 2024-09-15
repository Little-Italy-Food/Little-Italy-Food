import React, { useState, useEffect } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import Swal from "sweetalert2";

const Post = ({ data }) => {
  const [likes, setLikes] = useState(data.likedBy.length);
  const [liked, setLiked] = useState(
    data.likedBy.includes(localStorage.getItem("userId"))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (isUserModalOpen) {
      fetchUsers();
    }
  }, [isUserModalOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5001/posts/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        console.log("Fetched users:", result.users); // Log the users array
        setUsers(result.users);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSendPost = async () => {
    const token = localStorage.getItem("accessToken");

    console.log("Sending post to user:", selectedUserId); // Add this line

    try {
      const response = await fetch(
        "http://localhost:5001/posts/sendPostToUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postId: data._id,
            recipientId: selectedUserId,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        console.log("Post sent successfully:", result);
        setIsUserModalOpen(false);
        setSelectedUserId(null);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error sending post:", error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5001/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId: data._id }),
      });

      const result = await response.json();
      if (result.success) {
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes + (liked ? -1 : 1));
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error while liking the post:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID is not defined");
      return;
    }

    if (!data._id) {
      console.error("Post ID is not defined");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/posts/posts/${data._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            desc: comment,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setComment("");
        handleCloseModal();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error while submitting the comment:", error);
    }
  };

  const handleShare = async () => {
    const token = localStorage.getItem("accessToken");

    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to share this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, share it!",
    });

    if (!isConfirmed) {
      // User canceled the action
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/posts/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId: data._id }),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire("Shared!", "Your post has been shared.", "success");
        console.log("Post shared successfully:", result);
      } else {
        Swal.fire("Error!", result.message, "error");
        console.error(result.message);
      }
    } catch (error) {
      Swal.fire("Error!", "An error occurred while sharing the post.", "error");
      console.error("Error while sharing the post:", error);
    }
  };

  const extractMentions = (desc) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(desc)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const renderDescWithMentions = (desc) => {
    const mentionId = data.chefMentions?.[0]?.chefId;
    const url = mentionId ? `http://localhost:5173/chef/${mentionId}` : "";

    const parts = desc.split(/(@\w+)/g);

    if (parts.length === 1) {
      return desc;
    }

    return parts.map((part, index) => {
      const mentionUsername = part.match(/@\w+/);

      if (mentionUsername) {
        return (
          <a
            key={index}
            href={url}
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {mentionUsername[0]}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="Post">
      <div className="detail">
        <span>
          <b>{data.name}</b>
        </span>
        <span> {renderDescWithMentions(data.desc) || ""}</span>
      </div>

      <div className="mediaWrapper">
        {data.img && !data.video && (
          <img
            className="media"
            id="media1"
            src={`http://localhost:5001/${data.img}`}
            alt="Post Media"
          />
        )}
        {data.video && !data.img && (
          <video className="media" controls id="media1">
            <source
              src={`http://localhost:5001/${data.video}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
        {data.img && data.video && (
          <div className="mediaGallery">
            <img
              className="media"
              src={`http://localhost:5001/${data.img}`}
              alt="Post Image"
            />
            <video className="media" controls>
              <source
                src={`http://localhost:5001/${data.video}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt="like"
          onClick={handleLike}
          style={{ cursor: "pointer" }}
        />
        <img
          src={Comment}
          alt="comment"
          onClick={handleOpenModal}
          style={{ cursor: "pointer" }}
        />
        <img
          src={Share}
          alt="share"
          onClick={handleShare}
          style={{ cursor: "pointer" }}
        />
        <img
          src="data:image/png;base64,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"
          alt="send"
          onClick={() => setIsUserModalOpen(true)}
          style={{ cursor: "pointer", width: "1.5rem" }}
        />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>

      {/* Replies Section */}
      <div className="repliesSection">
        {data.replies.map((reply) => (
          <div key={reply._id} className="reply">
            <span>
              <b>
                {reply.userId?.username ? reply.userId.username : "Anonymous"}
              </b>
            </span>
            <p>{reply.desc}</p>
          </div>
        ))}
      </div>

      {/* Modal for Comment */}
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write your comment..."
            />
            <div className="modalButtons">
              <button onClick={handleSubmitComment}>Submit</button>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Selecting Users */}
      {isUserModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              width: "300px",
              maxHeight: "80%",
              overflowY: "auto",
            }}
          >
            <h2 style={{ margin: "0 0 10px" }}>Select a User to Send Post</h2>
            <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
              {users.map((user) => (
                <li
                  key={user.id} // Adjust this if the ID field is named differently
                  onClick={() => {
                    console.log("User clicked:", user.id); // Use the correct field name
                    setSelectedUserId(user.id);
                  }}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                    backgroundColor:
                      user.id === selectedUserId ? "#007bff" : "#f9f9f9", // Highlight selected item
                    color: user.id === selectedUserId ? "#fff" : "#000", // Change text color for selected item
                  }}
                >
                  {user.username}
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={handleSendPost}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Send Post
              </button>
              <button
                onClick={() => setIsUserModalOpen(false)}
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
