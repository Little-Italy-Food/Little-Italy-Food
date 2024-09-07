import React, { useState, useRef } from "react";
import ProfileImage from "../../img/5.jpeg";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";

const PostShare = () => {
  const [media, setMedia] = useState([]);
  const [description, setDescription] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const fileInputRef = useRef();

  const onMediaChange = (event) => {
    if (event.target.files) {
      let files = Array.from(event.target.files);
      setMedia((prevMedia) => [...prevMedia, ...files]);
    }
  };

  // Fetch mentions based on query
  const fetchMentions = async (query) => {
    const response = await fetch(
      `http://localhost:5001/posts/mentions/${query}`
    );
    const result = await response.json();
    if (result.success) {
      const suggestions = [
        ...result.users.map((user) => ({ ...user, type: "user" })),
        ...result.chefs.map((chef) => ({ ...chef, type: "chef" })),
      ];
      setMentionSuggestions(suggestions);
    }
  };

  const onDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    // Detect if the "@" symbol is typed
    const lastChar = value.charAt(value.length - 1);
    if (lastChar === "@") {
      setShowSuggestions(true);
      fetchMentions(""); // Fetch all initially
    } else if (showSuggestions) {
      const query = value.split("@").pop().trim();
      if (query.length > 0) {
        fetchMentions(query); // Fetch based on input after "@"
      } else {
        setMentionSuggestions([]); // Clear suggestions if no query
      }
    }
  };

  const handleMentionSelect = (mention) => {
    const mentionText = `@${mention.username} `;
    const newDesc = description.replace(/@\w*$/, mentionText);
    setDescription(newDesc);
    setShowSuggestions(false);
    setMentionSuggestions([]); // Clear the suggestions

    // Add mention ID to selectedMentions based on type
    setSelectedMentions((prev) => [
      ...prev,
      { id: mention.id, type: mention.type },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const images = media.filter((file) => file.type.startsWith("image/"));
    const videos = media.filter((file) => file.type.startsWith("video/"));

    images.forEach((file) => {
      formData.append("img", file);
    });

    videos.forEach((file) => {
      formData.append("video", file);
    });

    // Add the description (with mentions) to the form data
    formData.append("desc", description);

    // Add the selected mentions to the form data
    formData.append("mentions", JSON.stringify(selectedMentions));

    const userToken = localStorage.getItem("accessToken");

    const response = await fetch("http://localhost:5001/posts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      setMedia([]);
      setDescription("");
      setSelectedMentions([]);
      console.log("Post created successfully", result.post);
    } else {
      console.error("Error creating post", result.message);
    }
  };

  return (
    <div className="PostShare">
      <img src={ProfileImage} alt="" />
      <div>
        <input
          type="text"
          placeholder="What's happening"
          value={description}
          onChange={onDescriptionChange}
        />
        {showSuggestions && mentionSuggestions.length > 0 && (
          <div className="mentionSuggestions">
            {mentionSuggestions.map((mention, index) => (
              <div
                key={index}
                className="suggestionItem"
                onClick={() => handleMentionSelect(mention)}
              >
                {mention.username} {/* Adjust to show the correct property */}
              </div>
            ))}
          </div>
        )}
        <div className="postOptions">
          <div
            className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => fileInputRef.current.click()}
          >
            <UilScenery />
            Media
          </div>
          <div className="option" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option" style={{ color: "var(--shedule)" }}>
            <UilSchedule />
            Schedule
          </div>
          <button className="button ps-button" onClick={handleSubmit}>
            Share
          </button>
          <div style={{ display: "none" }}>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              ref={fileInputRef}
              onChange={onMediaChange}
            />
          </div>
        </div>
        {media.length > 0 && (
          <div className="previewMedia">
            {media.map((file, index) => (
              <div key={index} className="mediaItem">
                <UilTimes
                  onClick={() => setMedia(media.filter((_, i) => i !== index))}
                />
                {file.type.startsWith("video/") ? (
                  <video
                    controls
                    src={URL.createObjectURL(file)}
                    alt=""
                    width="350rem"
                    height="350rem"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    width="350rem"
                    height="350rem"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
