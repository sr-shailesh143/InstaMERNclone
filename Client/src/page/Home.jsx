import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Home() {
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [feedback, setfeedback] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]); 
  const [loading, setLoading] = useState(true);

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/allposts`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log("Fetched posts:", result); 
        setData(Array.isArray(result) ? result : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);
  

  const toggleComment = (posts) => {
    setShow(!show);
    setItem(posts);
  };

  const likePost = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/like`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) =>
          posts._id === result._id ? result : posts
        );
        setData(newData);
      });
  };

  const unlikePost = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/unlike`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) =>
          posts._id === result._id ? result : posts
        );
        setData(newData);
      });
  };

  const makeComment = (text, postId) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ text, postId }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.post) {
          setItem((prevItem) => ({
            ...prevItem,
            feedback: result.post.feedback || [],
          }));
          setfeedback(""); 
          notifyB(result.message || "Comment added successfully");
        } else {
          console.error("Unexpected response:", result);
          notifyA("Failed to add comment");
        }
      })
      .catch((err) => {
        console.error("Error posting comment:", err);
        notifyA("Failed to post comment");
      });
  };
  
  
  
  

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {loading ? (
        <p>Loading...</p>
      ) : Array.isArray(data) && data.length > 0 ? (
        data.map((posts) => (
          <div key={posts._id} className="bg-white shadow-md rounded-lg max-w-2xl mx-auto my-5 overflow-hidden">
            <div className="flex items-center px-4 py-2">
              <img
                className="w-10 h-10 rounded-full"
                src={posts.createdBy.image || picLink}
                alt="profile"
              />
              <h5 className="ml-3 font-semibold text-gray-800">
                <Link to={`/profile/${posts?.createdBy?._id}`}>{posts?.createdBy?.name || "Unknown User"}</Link>
              </h5>
            </div>
            <img className="w-full" src={posts.image} alt="Post" />
            <div className="p-4">
              {Array.isArray(posts.likedBy) && posts.likedBy.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <span
                  className="text-red-500 cursor-pointer"
                  onClick={() => unlikePost(posts._id)}
                >
                  ❤️
                </span>
              ) : (
                <span
                  className="text-gray-500 cursor-pointer"
                  onClick={() => likePost(posts._id)}
                >
                  🤍
                </span>
              )}

              <p className="font-medium text-gray-700 mt-2">
                {Array.isArray(posts.likedBy) ? posts.likedBy.length : 0} Likes
              </p>
              <p className="text-gray-700 mt-1">{posts.body}</p>
              <p className="text-blue-500 font-semibold cursor-pointer mt-2" onClick={() => toggleComment(posts)}>
                View all comments 
              </p>
            </div>
            <div className="flex items-center px-4 py-2 border-t">
              <input
                type="text"
                placeholder="Add a comment"
                className="flex-1 border-none focus:ring-0"
                value={feedback}
                onChange={(e) => setfeedback(e.target.value)}
              />
              <button
                className="text-blue-500 font-semibold"
                onClick={() => makeComment(feedback, posts._id)}
              >
                Post
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}

      {show && item ? (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-8/12 lg:w-6/12 p-4">
      {/* Post Image */}
<div className="mb-4">
  <img className="w-full rounded" src={item.image} alt="Post" />
</div>

{/* Posted By User */}
<div className="mb-4">
  <h5 className="font-semibold">{item?.createdBy?.name || "Unknown User"}</h5>
</div>

{/* Feedback Section */}
<div className="overflow-y-auto max-h-40">
  {Array.isArray(item.feedback) && item.feedback.length > 0 ? (
    item.feedback.map((feedback, index) => (
      <p key={index} className="text-gray-700">
        <span className="font-bold">{feedback?.author?.name || "Anonymous"}:</span>{" "}
        {feedback?.text || ""}
      </p>
    ))
  ) : (
    <p className="text-gray-500">No comments yet</p>
  )}
</div>





{/* Add Comment Section */}
<div className="flex items-center mt-4">
  <input
    type="text"
    placeholder="Add a comment"
    className="flex-1 border border-gray-300 rounded p-2"
    value={feedback}
    onChange={(e) => setfeedback(e.target.value)}
  />
  <button
    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => {
      makeComment(feedback, item._id);
      toggleComment(); 
    }}
  >
    Post
  </button>
</div>

      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-red-500 text-xl"
        onClick={() => toggleComment()} 
      >
        ✖
      </button>
    </div>
  </div>
) : null}

    </div>
  );
}
