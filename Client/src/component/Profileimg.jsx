import React, { useState, useEffect, useRef } from "react";

export default function Profileimg({ changeprofile }) {
  const hiddenFileInput = useRef(null);
  const [photo, setPhoto] = useState(null); 
  const [imageUrl, setImageUrl] = useState(""); 

  const postDetails = async () => {
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud2");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.statusText}`);
      }
      const result = await response.json();
      setImageUrl(result.url); 
    } catch (error) {
      console.error(error);
    }
  };

  const postPic = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/uploadProfilePic`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          pic: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend update failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      changeprofile(); 
      window.location.reload(); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  useEffect(() => {
    if (photo) {
      postDetails();
    }
  }, [photo]);

  useEffect(() => {
    if (imageUrl) {
      postPic();
    }
  }, [imageUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Change Profile Photo</h2>
        <hr className="border-gray-300" />
        <button
          className="w-full py-2 text-blue-500 font-semibold rounded hover:bg-blue-100 transition"
          onClick={() => hiddenFileInput.current.click()}
        >
          Upload Photo
        </button>
        <input
          type="file"
          ref={hiddenFileInput}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          className="w-full py-2 text-red-500 font-semibold rounded hover:bg-red-100 transition"
          onClick={() => {
            console.log("Remove current photo functionality not implemented yet");
          }}
        >
          Remove Current Photo
        </button>
        <button
          className="w-full py-2 text-gray-500 font-semibold rounded hover:bg-gray-100 transition"
          onClick={changeprofile}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
