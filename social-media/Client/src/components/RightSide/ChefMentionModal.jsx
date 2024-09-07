import React from "react";
import Modal from "react-modal";

const ChefMentionModal = ({
  modalOpened,
  setModalOpened,
  chefMentions,
  fullResponse,
}) => {
  const hasMentions = Array.isArray(chefMentions) && chefMentions.length > 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  const renderPostData = (post) => (
    <div
      key={post._id}
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <p>
        <strong>Post Description:</strong> {post.desc}
      </p>
      {post.img && (
        <img
          src={`http://localhost:5001/${post.img}`}
          alt="Post"
          style={{ width: "100%", borderRadius: "5px" }}
        />
      )}
      {post.video && (
        <video
          controls
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "5px",
          }}
        >
          <source
            src={`http://localhost:5001/${post.video}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}
      <p>
        <strong>Created At:</strong> {formatDate(post.createdAt)}
      </p>
      <p>
        <strong>Updated At:</strong> {formatDate(post.updatedAt)}
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={modalOpened}
      onRequestClose={() => setModalOpened(false)}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#f9f9f9", // Light background
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Slight shadow
          width: "500px", // Set width for modal
          maxHeight: "80vh", // Limit modal height for scroll
          overflowY: "auto", // Enable scroll if content exceeds modal height
        },
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>Chef Mentions</h2>

      {fullResponse && fullResponse.posts && fullResponse.posts.length > 0 ? (
        fullResponse.posts.map(renderPostData)
      ) : (
        <p style={{ textAlign: "center", color: "#999" }}>
          No chef mentions found.
        </p>
      )}

      <button
        onClick={() => setModalOpened(false)}
        style={{
          display: "block",
          margin: "20px auto 0",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </Modal>
  );
};

export default ChefMentionModal;
