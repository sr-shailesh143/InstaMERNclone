import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa"; // Import icons

export default function ReelsFeed() {
  const [reels, setReels] = useState([]);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("jwt"); // Get the token from localStorage

  const fetchReels = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reels/like/${reelId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        }
      );
      fetchReels(); // Re-fetch reels after liking/unliking
    } catch (err) {
      console.error(err);
      alert("Failed to like/unlike reel.");
    }
  };

  const handleComment = async (reelId) => {
    if (!comment) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reels/comment/${reelId}`,
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

  useEffect(() => {
    fetchReels();
  }, []);

  return (
    <div className="reels-feed max-w-screen-lg mx-auto p-5">
      <h1 className="text-center font-bold text-2xl mb-6">Reels Feed</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reels.map((reel) => (
          <div
            key={reel._id}
            className="reel-card border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300"
          >
            {/* Debugging: Log the video URL */}
            {console.log(reel.videoUrl)}

            {/* Video Section */}
            {reel.videoUrl ? (
              <video
                src={reel.videoUrl}
                controls
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            ) : (
              <p className="text-red-500">Video not available</p>
            )}

            <p className="text-sm mb-4">{reel.caption}</p>

            {/* Like/Unlike Button with Icon */}
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => handleLike(reel._id)}
                className={`text-xl ${
                  reel.isLiked ? "text-red-500" : "text-gray-500"
                } hover:text-red-600 transition-colors duration-200`}
              >
                {reel.isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
              <span>{reel.likesCount} Likes</span>
            </div>

            {/* Comments Section */}
            <div className="comments-section mt-4">
              <div className="comment-input flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleComment(reel._id)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  <FaComment />
                </button>
              </div>

              {/* Display Comments */}
              <div className="comments mt-2">
                {reel.comments.map((comment, index) => (
                  <div key={index} className="comment-item mb-2">
                    <p className="text-sm">
                      <strong>{comment.user.name}:</strong> {comment.text}
                    </p>
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
