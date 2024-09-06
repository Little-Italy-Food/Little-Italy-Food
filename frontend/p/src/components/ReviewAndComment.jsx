import React, { useState, useEffect } from "react";
import { Star, Upload, Edit3, Trash2, MessageCircle } from "lucide-react"; // Added MessageCircle for reply icon
import axios from "axios";

const ReviewAndComment = ({ id }) => {
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [replyContent, setReplyContent] = useState(""); // State for replies
  const [replyingReviewId, setReplyingReviewId] = useState(null); // Review ID to which the user is replying

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/reviews/recipe/${id}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("recipeId", id);
    formData.append("content", comment);
    formData.append("rating", rating);

    if (image) formData.append("mainImage", image);
    if (video) formData.append("video", video);

    try {
      const token = localStorage.getItem("token");

      let response;
      if (editingReviewId) {
        response = await axios.put(
          `http://localhost:5001/api/reviews/${editingReviewId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5001/api/reviews",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.status === 201 || response.status === 200) {
        alert("Review submitted successfully!");

        const newReview = response.data;

        if (newReview.image) {
          newReview.image = `http://localhost:5001/${newReview.image}`;
        }
        if (newReview.video) {
          newReview.video = `http://localhost:5001/${newReview.video}`;
        }

        setReviews((prevReviews) =>
          editingReviewId
            ? prevReviews.map((r) =>
                r._id === editingReviewId ? newReview : r
              )
            : [newReview, ...prevReviews]
        );

        setShowCommentSection(false);
        setComment("");
        setRating(0);
        setImage(null);
        setVideo(null);
        setEditingReviewId(null);
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("You cannot submit a review as a chef.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setComment(review.content);
    setRating(review.rating);
    setImage(null);
    setVideo(null);
    setShowCommentSection(true);
  };

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5001/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews((prevReviews) =>
        prevReviews.filter((r) => r._id !== reviewId)
      );
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };

  const handleReply = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5001/api/reviews/${reviewId}/reply`,
        { content: replyContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Reply submitted successfully!");

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === reviewId
              ? { ...review, replies: [...review.replies, response.data] }
              : review
          )
        );

        setReplyContent("");
        setReplyingReviewId(null);
      } else {
        alert("Failed to submit reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply.");
    }
  };

  return (
    <>
      <div className="lg:px-32 px-10 mx-auto p-6 bg-white rounded-lg shadow-lg mt-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Reviews
        </h1>

        {reviews.length > 0 ? (
          reviews.map((review) => {
            if (!review || !review._id || !review.userId) return null;

            return (
              <div
                key={review._id}
                className="mb-8 p-6 bg-gray-100 rounded-lg shadow relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${
                        review.userId?.username || "Anonymous"
                      }`}
                      alt="user avatar"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  </div>

                  {localStorage.getItem("userId") === review.userId._id && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <p className="mb-4 text-gray-700">{review.content}</p>

                <div className="flex justify-between space-x-4">
                  {review.image && (
                    <div className="w-1/2 aspect-square h-[15rem]">
                      <img
                        src={`http://localhost:5001/${review.image}`}
                        alt="Review image"
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  )}

                  {review.video && (
                    <div className="w-1/2 aspect-square h-[15rem]">
                      <video
                        controls
                        className="w-full h-full object-cover rounded-lg"
                      >
                        <source
                          src={`http://localhost:5001/${review.video}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>

                <p className="text-gray-500 text-sm">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>

                {/* Reply Section */}
                {review.replies && review.replies.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Replies</h2>
                    {review.replies.map((reply) => (
                      <div
                        key={reply._id}
                        className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center mb-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${
                              reply.chefId?.username || "Anonymous"
                            }`}
                            alt="chef avatar"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <p className="font-semibold text-gray-800">
                            {reply.chefId?.username || "Anonymous"}
                          </p>
                        </div>
                        <p className="text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply here..."
                    className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={() => handleReply(review._id)}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                  >
                    Reply
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        )}

        {!showCommentSection && (
          <button
            onClick={() => setShowCommentSection(true)}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Write a Review
          </button>
        )}

        {showCommentSection && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  onClick={() => handleRating(star)}
                  className={`cursor-pointer ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="image-upload"
                  className="block w-full cursor-pointer bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-200 transition duration-300"
                >
                  <Upload size={20} className="inline-block mr-2" />
                  Upload Image
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="video-upload"
                  className="block w-full cursor-pointer bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-200 transition duration-300"
                >
                  <Upload size={20} className="inline-block mr-2" />
                  Upload Video
                </label>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
            >
              {isSubmitting
                ? "Submitting..."
                : editingReviewId
                ? "Update Review"
                : "Submit Review"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewAndComment;
