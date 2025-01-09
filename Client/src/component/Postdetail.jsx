import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Postdetail({ item, toggleDetails }) {
  const navigate = useNavigate();

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const removePost = async (postId) => {
    if (window.confirm("Do you really want to delete this post?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deletePost/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        });

        const result = await response.json();
        if (response.ok) {
          notifySuccess(result.message);
          toggleDetails();
          navigate("/");
        } else {
          notifyError(result.error || "Failed to delete the post.");
        }
      } catch (error) {
        notifyError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full h-full fixed top-0 left-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 overflow-hidden relative">
        {/* Post Image */}
        <div className="bg-gray-900 flex items-center justify-center h-64">
          <img src={item.photo || '/default-image.jpg'} alt="Post" className="object-contain h-full w-full" />
        </div>

        {/* Post Details */}
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              <img
                src={item.postedBy.photo || '/default-profile.jpg'}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <h5 className="text-lg font-semibold">{item.postedBy.name}</h5>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => removePost(item._id)}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>

          {/* Comments */}
          <div className="space-y-2 border-b pb-2">
            {(item.comments && item.comments.length > 0) ? (
              item.comments.map((comment, index) => (
                <p key={index} className="text-sm">
                  <span className="font-bold">{comment.postedBy.name}</span>: {comment.text}
                </p>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>

          {/* Post Content */}
          <div className="space-y-2">
            <p className="font-semibold">{item.likes.length} Likes</p>
            <p>{item.body || "No content available."}</p>
          </div>

          {/* Add Comment */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-500">mood</span>
            <input
              type="text"
              placeholder="Add a comment"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Post
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1"
          onClick={toggleDetails}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
}
