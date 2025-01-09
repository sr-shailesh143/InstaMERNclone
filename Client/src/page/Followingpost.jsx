import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Followingpost() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState(null); 
  
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }
  
    fetch(`${import.meta.env.VITE_BACKEND_URL}/myfollowingpost`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        return res.json();
      })
      .then((result) => {
        setData(result); 
        console.log(result); 
      })
      .catch((err) => {
        console.log(err);
        notifyA("Failed to load posts");
      });
  }, []);
  
  const likePost = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/like`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  
  const unlikePost = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/unlike`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("Comment posted");
      })
      .catch((err) => console.log(err));
  };

  const toggleComment = (post) => {
    setShow(!show);
    setItem(post); 
  };

  return (
    <div className="home flex flex-col items-center bg-gray-100 py-6">
      {/* Card */}
      {data.map((posts) => (
        <div
          key={posts._id}
          className="card w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden mb-6"
        >
          {/* Card Header */}
          <div className="card-header flex items-center p-4 border-b border-gray-200">
            <div className="card-pic w-10 h-10 mr-4">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                alt="Profile"
                className="rounded-full"
              />
            </div>
            <h5 className="text-lg font-semibold">
              {/* Add optional chaining to prevent undefined errors */}
              <Link to={`/profile/${posts.createdBy?._id}`} className="hover:underline">
                {posts.createdBy?.name || "Unknown User"}
              </Link>
            </h5>
          </div>

          {/* Card Image */}
          <div className="card-image">
            <img
              src={posts.image}
              alt="Post"
              className="w-full object-cover max-h-72"
            />
          </div>

          {/* Card Content */}
          <div className="card-content p-4">
            {Array.isArray(posts.likedBy) && posts.likedBy.includes(
              JSON.parse(localStorage.getItem("user"))?._id
            ) ? (
              <span
                className="material-symbols-outlined text-red-500 cursor-pointer"
                onClick={() => unlikePost(posts._id)}
              >
                favorite
              </span>
            ) : (
              <span
                className="material-symbols-outlined text-gray-500 cursor-pointer"
                onClick={() => likePost(posts._id)}
              >
                favorite
              </span>
            )}

            <p className="text-gray-700 font-medium mt-2">{posts.likedBy?.length || 0} Likes</p>
            <p className="text-gray-800 mt-1">{posts.content}</p>
            <p
              className="text-blue-500 font-semibold mt-2 cursor-pointer hover:underline"
              onClick={() => toggleComment(posts)}
            >
              View all comments
            </p>
          </div>

          {/* Add Comment */}
          <div className="add-comment flex items-center px-4 py-3 border-t border-gray-200">
            <span className="material-symbols-outlined text-gray-500 mr-4">mood</span>
            <input
              type="text"
              placeholder="Add a comment"
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="ml-4 text-blue-500 font-semibold hover:underline"
              onClick={() => makeComment(comment, posts._id)}
            >
              Post
            </button>
          </div>
        </div>
      ))}

      {/* Show Comment Modal */}
      {show && item && (
        <div className="showComment fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="container bg-white rounded-lg shadow-lg max-w-2xl w-full overflow-hidden">
            <div className="postPic bg-gray-800">
              <img src={item.image} alt="Post" className="w-full object-cover" />
            </div>
            <div className="details p-4 flex flex-col">
              {/* Card Header */}
              <div className="card-header flex items-center pb-4 border-b border-gray-200">
                <div className="card-pic w-10 h-10 mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt="Profile"
                    className="rounded-full"
                  />
                </div>
                <h5 className="text-lg font-semibold">{item.createdBy?.name || "Unknown User"}</h5>
              </div>

              {/* Comment Section */}
              <div className="comment-section flex-grow py-4 border-b border-gray-200">
                {item.feedback?.map((comment, index) => (
                  <p key={index} className="text-gray-800">
                    <span className="font-bold mr-2">{comment.author?.name || "Unknown User"}</span>
                    {comment.text}
                  </p>
                ))}
              </div>

              {/* Card Content */}
              <div className="card-content py-4">
                <p className="text-gray-700 font-medium">{item.likedBy?.length || 0} Likes</p>
                <p className="text-gray-800 mt-1">{item.content}</p>
              </div>

              {/* Add Comment */}
              <div className="add-comment flex items-center pt-4 border-t border-gray-200">
                <span className="material-symbols-outlined text-gray-500 mr-4">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="flex-grow border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="ml-4 text-blue-500 font-semibold hover:underline"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment(null); 
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <button
            className="close-comment absolute top-5 right-5 text-white text-3xl font-bold"
            onClick={() => toggleComment(null)} 
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
