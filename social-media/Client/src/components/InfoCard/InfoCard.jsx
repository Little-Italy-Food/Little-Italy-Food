import React, { useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal.jsx/ProfileModal";
import { useNavigate } from "react-router-dom";

const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    localStorage.clear(); // Clear all items in local storage
    navigate("/"); // Redirect to the home page
  };

  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4>Your Info</h4>
        <div>
          <UilPen
            width="2rem"
            height="1.2rem"
            onClick={() => setModalOpened(true)}
          />
          <ProfileModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
          />
        </div>
      </div>

      <div className="info">
        <span>
          <b>Status </b>
        </span>
        <span>single little chef</span>
      </div>

      <div className="info">
        <span>
          <b>Lives in </b>
        </span>
        <span>jordan</span>
      </div>

      <div className="info">
        <span>
          <b>Works at </b>
        </span>
        <span>orange coding academy</span>
      </div>

      <button className="button logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default InfoCard;
