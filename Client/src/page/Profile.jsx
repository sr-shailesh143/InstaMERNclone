import React, { useEffect, useState } from "react";
import Postdetail from "../component/Postdetail";
import ProfileImg from "../component/ProfileImg.jsx"; 
import { toast } from "react-toastify";

export default function Profile() {
  const defaultPic = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [pic, setPic] = useState([]); 
  const [show, setShow] = useState(false); 
  const [selectedPost, setSelectedPost] = useState(null); 
  const [user, setUser] = useState({}); 
  const [changePic, setChangePic] = useState(false);
  const [loading, setLoading] = useState(false); 

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const toggleDetails = (post) => {
    setShow(!show);
    setSelectedPost(post);
  };

  const changeProfile = () => {
    setChangePic(!changePic);
  };

  const fetchUserProfile = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setPic(result.posts || []);
      setUser(result.user || {});
    } catch (error) {
      notifyError("Error loading profile. Please try again later.");
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deletePost/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        notifySuccess(result.message);
        setPic((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } else {
        notifyError(result.error || "Failed to delete the post.");
      }
    } catch (error) {
      notifyError("Something went wrong. Please try again.");
    }
  };
  

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Section */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="relative">
          <img
            onClick={changeProfile}
            src={user.photo || defaultPic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </div>

        <div className="flex-1 ml-6">
          <h1 className="text-2xl font-bold text-gray-800">{user.name || "User"}</h1>
          <div className="flex space-x-8 mt-2 text-gray-600">
            <p><span className="font-bold">{pic.length}</span> posts</p>
            <p><span className="font-bold">{user.followers?.length || 0}</span> followers</p>
            <p><span className="font-bold">{user.following?.length || 0}</span> following</p>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
            onClick={changeProfile}
          >
            Change Picture
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-3 gap-4">
        {pic.length > 0 ? (
          pic.map((post) => (
            <div key={post._id} className="relative group">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-40 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => toggleDetails(post)}
              />
              <button
                className={`absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full ${
                  loading ? "opacity-50" : "opacity-0"
                } group-hover:opacity-100 transition duration-300`}
                disabled={loading}
                onClick={() => deletePost(post._id)}
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No posts to display.</p>
        )}
      </div>

      {show && <Postdetail item={selectedPost} toggleDetails={toggleDetails} />}
      {changePic && <ProfileImg refreshProfile={fetchUserProfile} changeProfile={changeProfile} />}
    </div>
  );
}
