import React, { useEffect, useState } from "react";
import Cover from "../../img/6.jpg";
import Profile from "../../img/5.jpeg";
import "./ProfileCard.css";

const ProfileCard = () => {
  const ProfilePage = true;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found in local storage.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5001/posts/user/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
        } else {
          console.error("Failed to fetch user data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img src={Cover} alt="" />
        <img src={Profile} alt="" />
      </div>

      <div className="ProfileName">
        <div className="ProfileName">
          <span>{userData ? userData.username : "Loading..."}</span>
        </div>{" "}
        <span>
          Hi, I'm {userData ? userData.username : "Loading..."}, a recipe
          creator who loves crafting healthy, delicious dishes.
        </span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>6,890</span>
            <span>Followings</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>1</span>
            <span>Followers</span>
          </div>

          {ProfilePage && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>3</span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
      </div>
      {ProfilePage ? "" : <span>My Profile</span>}
    </div>
  );
};

export default ProfileCard;
