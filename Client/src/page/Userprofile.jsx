import React, { useEffect, useState } from "react";
import PostDetail from "../component/Postdetail";
import { useParams } from "react-router-dom";

export default function Userprofile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

  // Follow user
  const followUser = (userId) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsFollow(true);
      });
  };

  // Unfollow user
  const unfollowUser = (userId) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsFollow(false);
      });
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.user);
        setPosts(result.post);
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsFollow(true);
        }
      });
  }, [isFollow]);

  return (
    <div className="max-w-4xl mx-auto p-5 bg-gray-50 shadow-md rounded-lg">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
        {/* Profile Picture */}
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
          <img
            src={user.Photo ? user.Photo : picLink}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Data */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <h1 className="text-2xl font-bold text-gray-700">{user.name}</h1>
            <button
              className={`py-2 px-6 text-sm font-semibold rounded-lg shadow-lg transition-all ${
                isFollow
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => {
                isFollow ? unfollowUser(user._id) : followUser(user._id);
              }}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
          </div>

          <div className="flex space-x-6 mt-4 text-gray-600">
            <p>{posts.length} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-300" />

      {/* Gallery */}
      <div className="grid grid-cols-3 gap-4">
        {posts.map((pics) => (
          <img
            key={pics._id}
            src={pics.photo}
            alt="Post"
            className="w-full h-48 object-cover rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg"
          />
        ))}
      </div>
    </div>
  );
}
