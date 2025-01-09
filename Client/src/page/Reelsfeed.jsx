import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaComment, FaTrashAlt } from "react-icons/fa";

export default function ReelsFeed() {
  const [reels, setReels] = useState([]);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("jwt"); 

  const fetchReels = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setReels(response.data.reels);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reels. Please ensure you are logged in.");
    }
  };

  const handleLike = async (reelId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/like/${reelId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReels(); 
    } catch (err) {
      console.error(err);
      alert("Failed to like/unlike reel.");
    }
  };

  const handleComment = async (reelId) => {
    if (!comment) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${reelId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReels();
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment.");
    }
  };

  const handleDeleteReel = async (reelId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete/${reelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReels(); 
      alert("Reel deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete reel.");
    }
  };

  const handleDeleteComment = async (reelId, commentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${reelId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReels(); 
      alert("Comment deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment.");
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  return (
    <div className="reels-feed max-w-screen-md mx-auto p-4">
      <h1 className="text-center font-bold text-2xl mb-6">Reels Feed</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {reels.map((reel) => (
          <div
            key={reel._id}
            className="reel-card border rounded-lg shadow-md bg-white overflow-hidden"
          >
            {/* Video Section */}
            <div className="relative">
              <video
                src={reel.videoUrl}
                controls
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => handleDeleteReel(reel._id)}
                className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
              >
                <FaTrashAlt />
              </button>
            </div>

            {/* Caption */}
            <p className="text-sm mt-2 px-4">{reel.caption}</p>

            {/* Like/Unlike */}
            <div className="flex items-center space-x-4 mt-2 px-4">
              <button
                onClick={() => handleLike(reel._id)}
                className={`text-xl ${
                  reel.isLiked ? "text-red-500" : "text-gray-500"
                } hover:text-red-600 transition`}
              >
                {reel.isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
              <span>{reel.likesCount} Likes</span>
            </div>

            {/* Comments */}
            <div className="mt-4 px-4">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="border p-2 rounded w-full focus:ring focus:ring-blue-400"
                />
                <button
                  onClick={() => handleComment(reel._id)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  <FaComment />
                </button>
              </div>

              {/* Display Comments */}
              <div className="space-y-2">
                {reel.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex justify-between items-center text-sm border-b pb-2"
                  >
                    <p>
                      <strong>{comment.user.name}:</strong> {comment.text}
                    </p>
                    <button
                      onClick={() => handleDeleteComment(reel._id, comment._id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
