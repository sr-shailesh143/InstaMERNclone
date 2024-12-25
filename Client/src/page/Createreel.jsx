import React, { useState } from 'react';
import axios from 'axios';

const Createreel = () => {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("jwt"); // Get token from localStorage
    const formData = new FormData();
    formData.append("video", video);
    formData.append("caption", caption);
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      });
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to upload reel.");
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🎥 Create Reel</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          required
          className="mb-2"
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload Reel
        </button>
      </form>
    </div>
  );
};

export default Createreel;
