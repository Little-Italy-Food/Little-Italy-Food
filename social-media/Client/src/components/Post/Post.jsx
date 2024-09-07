import React, { useState, useEffect } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";

const Post = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(data.likedBy.length);
  const [liked, setLiked] = useState(false);
  const userId = localStorage.getItem("userId");

  // Fetch post data to initialize liked state
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/posts/${data._id}`);
        const postData = await response.json();
        setLikes(postData.likedBy.length);
        setLiked(postData.likedBy.includes(userId));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post data:", error);
        setLoading(false);
      }
    };

    fetchPostData();
  }, [data._id, userId]);

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
        // Toggle liked state and update likes count
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes + (liked ? -1 : 1));
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error while liking the post:", error);
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="Post">
      <div className="detail">
        <span>
          <b>{data.userId.username}</b>
        </span>
        <span> {data.desc}</span>
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
        <img src={Comment} alt="comment" />
        <img src={Share} alt="share" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
    </div>
  );
};

export default Post;
