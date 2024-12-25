import React, { useEffect, useState } from "react";
import PostDetail from "../component/Profileimg";
import Profileimg from "../component/Profileimg";

export default function Profile() {
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [changePic, setChangePic] = useState(false);

  const toggleDetails = (posts) => {
    setShow(!show);
    setPosts(posts);
  };

  const changeProfile = () => {
    setChangePic(!changePic);
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        setPic(result.photo || []); 
        setUser(result.user || {}); 
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        alert("There was an error loading the profile. Please try again later.");
      }
    };
  
    fetchUserProfile();
  }, []);
  

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile frame */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4">
        {/* Profile picture */}
        <div className="relative">
          <img
            onClick={changeProfile}
            src={user.photo ? user.photo : picLink}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </div>
        {/* Profile data */}
        <div className="flex-1 ml-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {user.name || JSON.parse(localStorage.getItem("user")).name}
          </h1>
          <div className="flex space-x-4 mt-2 text-gray-600">
            <p>{pic.length} posts</p>
            <p>{user.followers ? user.followers.length : 0} followers</p>
            <p>{user.following ? user.following.length : 0} following</p>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg"
            onClick={changeProfile}
          >
            Change Picture
          </button>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Gallery */}
      <div className="grid grid-cols-3 gap-4">
        {pic.map((pics) => (
          <img
            key={pics._id}
            src={pics.photo}
            alt="Post"
            className="w-full h-40 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => toggleDetails(pics)}
          />
        ))}
      </div>

      {/* Post Details */}
      {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}

      {/* Change Profile Picture */}
      {changePic && <Profileimg changeProfile={changeProfile} />}
    </div>
  );
}
