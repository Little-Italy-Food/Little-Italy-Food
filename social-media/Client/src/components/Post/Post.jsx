import React from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";

const Post = ({ data }) => {
  return (
    <div className="Post">
      <div className="detail">
        <span>
          <b>{data.name}</b>
        </span>
        <span> {data.desc}</span>
      </div>
      <div className="mediaWrapper">
        {data.img && !data.video && (
          <img
            className="media"
            src={`http://localhost:5001/${data.img}`}
            alt=""
          />
        )}
        {data.video && !data.img && (
          <video className="media" controls>
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
              alt=""
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
        <img src={data.liked ? Heart : NotLike} alt="" />
        <img src={Comment} alt="" />
        <img src={Share} alt="" />
      </div>
      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {data.likes} likes
      </span>
    </div>
  );
};

export default Post;
