import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Createpost() {
  const [content, setcontent] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (url) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/createPost`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                content,
                image: url, // Fixed field name
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    notifyA(data.error);
                } else {
                    notifyB("Successfully Posted");
                    navigate("/");
                }
            })
            .catch((err) => console.log(err));
    }
}, [url]);


  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud2");
    fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((err) => console.log(err));
  };

  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

  return (
    <div className="max-w-lg mx-auto my-5 border border-gray-300 rounded-md shadow-lg bg-white p-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h4 className="text-lg font-semibold">Create New Post</h4>
        <button
          className="text-blue-500 font-bold hover:text-blue-600 transition"
          onClick={postDetails}
        >
          Share
        </button>
      </div>

      {/* Image Preview */}
      <div className="flex flex-col items-center border-t py-5">
        <img
          id="output"
          className="w-48 h-48 object-contain mb-4"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
          alt="preview"
        />
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(event) => {
            loadfile(event);
            setImage(event.target.files[0]);
          }}
        />
      </div>

      {/* Post Details */}
      <div className="border-t py-4">
        <div className="flex items-center mb-3">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            alt="profile-pic"
          />
          <h5 className="ml-3 font-semibold text-gray-700">Shailesh</h5>
        </div>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 outline-none focus:border-blue-500 transition"
          rows="3"
          placeholder="Write a caption..."
          value={content}
          onChange={(e) => setcontent(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}
