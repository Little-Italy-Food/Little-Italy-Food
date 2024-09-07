import React, { useEffect, useState } from "react";
import "./Posts.css";
import Post from "../Post/Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5001/posts/allposts");
        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const intervalId = setInterval(fetchPosts, 5000);
    fetchPosts();

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="Posts">
      {posts.map((post) => (
        <Post
          key={post._id}
          data={{
            ...post,
            name:
              post.userId && post.userId.username
                ? post.userId.username
                : "Anonymous",
          }}
        />
      ))}
    </div>
  );
};

export default Posts;
