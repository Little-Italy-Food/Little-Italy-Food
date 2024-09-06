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
  const fileInputRef = useRef();

  const onMediaChange = (event) => {
    if (event.target.files) {
      let files = Array.from(event.target.files);
      setMedia((prevMedia) => [...prevMedia, ...files]);
    }
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

    formData.append("desc", description);

    const userToken = localStorage.getItem("accessToken");

    const response = await fetch("http://localhost:5001/posts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`, // Token for authentication
      },
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      // Handle success, maybe reset form or display a success message
      setMedia([]);
      setDescription("");
      console.log("Post created successfully", result.post);
    } else {
      // Handle error
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
          onChange={(e) => setDescription(e.target.value)} // Update description state
        />
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
