import React from "react";
import "./RightSide.css";

const CommentModal = ({ modalOpened, setModalOpened, posts }) => {
  console.log(posts);
  if (!modalOpened) return null;

  return (
    <div className="comment-modal">
      <div className="comment-modal-content">
        <span className="close" onClick={() => setModalOpened(false)}>
          &times;
        </span>
        <h2>Shared Posts</h2>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post._id}>
                <div>
                  <strong>Description:</strong> {post.desc}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(post.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Image:</strong>{" "}
                  <img src={`http://localhost:5001/${post.img}`} alt="Post" />
                </div>
                <div>
                  <strong>Video:</strong>{" "}
                  <video controls src={`http://localhost:5001/${post.video}`} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
