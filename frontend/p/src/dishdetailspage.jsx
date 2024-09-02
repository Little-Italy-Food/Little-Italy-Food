import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Pizza, Euro, User, Send, MessageSquare } from 'lucide-react';

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading dish details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-red-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-green-200">
          <div className="relative h-64 sm:h-80 lg:h-96">
            <img src={dish.imageUrl || "/api/placeholder/800/600"} alt={dish.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h1 className="text-4xl font-bold text-white font-serif">{dish.title}</h1>
            </div>
          </div>
          <div className="p-6">
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
              placeholder="Aggiungi un commento..."
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
              <p className="font-bold">Attenzione!</p>
              <p>Devi effettuare l'accesso per lasciare un commento o una risposta. <a href="/login" className="text-blue-500 hover:underline">Accedi qui</a>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishDetailsPage;