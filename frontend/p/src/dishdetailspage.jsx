import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link , useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pizza, Euro, User, Send, MessageSquare, Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { CartContext } from './cartcontext';
import Navbar from './navbar';

const DishDetailsPage = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setUser({ id: userId });
    }

    const fetchDishDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/dishescategory/${id}`);
        setDish(response.data);
        await fetchComments();
        await fetchRatings();
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dish details:', err);
        setError('Error fetching dish details. Please try again later.');
        setLoading(false);
      }
    };

    fetchDishDetails();
  }, [id]);

  const fetchComments = async () => {
    try {
      const commentsResponse = await axios.get(`http://localhost:5001/api/comments/dish/${id}`);
      setComments(commentsResponse.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Error fetching comments. Please try again later.');
    }
  };

  const fetchRatings = async () => {
    try {
      const ratingsResponse = await axios.get(`http://localhost:5001/api/ratings/dish/${id}`);
      const { averageRating, totalRatings, userRating } = ratingsResponse.data;
      setAverageRating(averageRating);
      setTotalRatings(totalRatings);
      if (userRating) setUserRating(userRating);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setLoginPrompt(true);
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5001/api/comments`, {
        dishId: id,
        content: newComment
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!user) {
      setLoginPrompt(true);
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5001/api/comments/${commentId}/reply`, {
        replyContent
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      const updatedComments = comments.map(comment => 
        comment._id === commentId ? response.data : comment
      );
      setComments(updatedComments);
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Error submitting reply:', err);
    }
  };

  const handleRatingSubmit = async (rating) => {
    if (!user) {
      setLoginPrompt(true);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        setLoginPrompt(true);
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5001/api/ratings`,
        {
          dishId: id,
          rating
        },
        {
          headers: { 'x-auth-token': token }
        }
      );
  
      console.log('Rating submission response:', response.data);
      setUserRating(rating);
      await fetchRatings();
    } catch (err) {
      console.error('Error submitting rating:', err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 401) {
        console.error('Authentication failed. Token may be invalid or expired.');
        setLoginPrompt(true);
      }
    }
  };

  const handleAddToCart = () => {
    if (dish) {
      addToCart({ ...dish, quantity });
      setQuantity(1); // Reset quantity after adding to cart
      navigate('/cart'); // Navigate to the cart page
    }
  };
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const renderStars = (rating, onStarClick = null) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={24}
        fill={star <= rating ? "#FFD700" : "none"}
        stroke={star <= rating ? "#FFD700" : "#CBD5E0"}
        className={onStarClick ? "cursor-pointer" : ""}
        onClick={() => onStarClick && onStarClick(star)}
      />
    ));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading dish details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-red-100 py-8">
        <Navbar></Navbar>
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-green-200">
          <div className="relative h-64 sm:h-80 lg:h-96">
            <img src={dish.imageUrl || "/api/placeholder/800/600"} alt={dish.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h1 className="text-4xl font-bold text-white font-serif">{dish.title}</h1>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {renderStars(averageRating)}
              </div>
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-2">({totalRatings} ratings)</span>
            </div>
            <p className="text-xl text-gray-700 mb-4 italic">{dish.description}</p>
            <div className="flex items-center mb-4">
              <Pizza className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-lg text-gray-600">{dish.ingredients}</span>
            </div>
            <div className="flex items-center mb-4">
              <Euro className="w-6 h-6 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-700">{dish.price}</span>
            </div>
            <div className="bg-red-500 text-white px-3 py-1 rounded-full inline-block">
              {dish.category}
            </div>
          </div>
          {user && (
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Your Rating</h3>
              <div className="flex items-center">
                {renderStars(userRating, handleRatingSubmit)}
                {userRating > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    Your rating: {userRating}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-6 bg-white rounded-lg shadow-xl border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={decrementQuantity} className="bg-gray-200 p-2 rounded-l">
                <Minus size={18} />
              </button>
              <span className="px-4 py-2 bg-gray-100">{quantity}</span>
              <button onClick={incrementQuantity} className="bg-gray-200 p-2 rounded-r">
                <Plus size={18} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <ShoppingCart className="mr-2" size={18} />
              Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-xl p-6 border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-4 text-red-700 font-serif">Comments</h2>
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-semibold text-gray-700">{comment.userId?.username || 'Anonymous'}</span>
                  {user && user.id === comment.userId?._id && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                  )}
                </div>
                <p className="text-gray-600">{comment.content}</p>
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-300">
                    {comment.replies.map((reply, index) => (
                      <div key={index} className="mt-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="font-semibold text-sm text-gray-600">{reply.userId?.username || 'Anonymous'}</span>
                          {user && user.id === reply.userId?._id && (
                            <span className="ml-2 text-xs bg-green-400 text-blue-800 px-2 py-1 rounded-full">You</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{reply.replyContent}</p>
                      </div>
                    ))}
                  </div>
                )}

                {user && (replyingTo !== comment._id ? (
                  <button
                    onClick={() => setReplyingTo(comment._id)}
                    className="mt-2 text-sm text-green-500 flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Reply
                  </button>
                ) : (
                  <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="mt-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                    ></textarea>
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="mr-2 text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        Send Reply
                      </button>
                    </div>
                  </form>
                ))}
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="3"
            ></textarea>
            <button
              type="submit"
              className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
            >
              <Send className="mr-2" size={18} />
              Comment
            </button>
          </form>
          {loginPrompt && (
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p className="font-bold">Attention!</p>
              <p>You must be logged in to leave a comment or reply. <Link to="/login" className="text-blue-500 hover:underline">Log in here</Link>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishDetailsPage;






  