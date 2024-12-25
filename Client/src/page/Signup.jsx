import React, { useState } from "react";
import logo from "../../public/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const postData = () => {
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    } else if (!passRegex.test(password)) {
      notifyA(
        "Password must contain at least 8 characters, including at least 1 number and both upper/lowercase letters and special characters."
      );
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.message);
          navigate("/signin");
        }
      });
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex justify-center items-center" style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB1lN1hGZAj0MpZ1ZoN7tt7q38JyzTvjmSMQ&usqp=CAU')" }}>
      <div className="bg-white p-8 border shadow-lg rounded-md w-96">
        <img className="w-48 mx-auto mb-4" src={logo} alt="Logo" />
        <p className="text-center text-gray-500 mb-4">
          Sign up to see photos and videos <br /> from your friends.
        </p>
        <div className="space-y-4">
        <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="text-xs text-center text-gray-500 my-3">
          By signing up, you agree to our Terms, <br /> Privacy Policy and Cookies Policy.
        </p>
        <button
          onClick={postData}
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
