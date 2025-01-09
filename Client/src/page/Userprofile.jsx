import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Userprofile() {
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${userid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const result = await res.json();
      console.log(result); 
  
      const localUser = JSON.parse(localStorage.getItem("user")) || {};
  
      setUser(result.user);
      setPosts(result.posts || []); 
      setIsFollow(result.user.followers?.includes(localUser._id));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const followUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/follow`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ followId: userid }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsFollow(true);
        setUser((prevUser) => ({
          ...prevUser,
          followers: [...(prevUser.followers || []), data.currentUser._id],
        }));
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/unfollow`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ followId: userid }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsFollow(false);
        setUser((prevUser) => ({
          ...prevUser,
          followers: prevUser.followers?.filter((id) => id !== data.currentUser._id),
        }));
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userid]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
          <img
            src={user.Photo ? user.Photo : picLink}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info and Actions */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex justify-between items-center md:justify-start gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <button
              className={`py-2 px-6 text-sm font-semibold rounded-lg transition-all ${
                isFollow
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={isFollow ? unfollowUser : followUser}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="flex justify-center md:justify-start mt-4 text-gray-600">
            <p className="mr-6"><span className="font-semibold">{posts.length}</span> posts</p>
            <p className="mr-6"><span className="font-semibold">{user.followers?.length || 0}</span> followers</p>
            <p><span className="font-semibold">{user.following?.length || 0}</span> following</p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <hr className="my-8 border-gray-300" />
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="relative group">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-80 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105 group-hover:shadow-lg"
            />
            {/* Like and Comment Buttons */}
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-white bg-black/60 rounded-full p-3 mx-1 hover:bg-black">
                <i className="fas fa-heart"></i> 
              </button>
              <button className="text-white bg-black/60 rounded-full p-3 mx-1 hover:bg-black">
                <i className="fas fa-comment"></i> 
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
