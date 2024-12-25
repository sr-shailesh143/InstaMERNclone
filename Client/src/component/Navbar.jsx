import React, { useContext } from "react";
import logo from "../../public/logo.png";
import { Link } from "react-router-dom";
import { Authcontext } from "../context/Authcontext.js";

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(Authcontext);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
        <Link to="/" className="nav-link font-bold">
            Postes
          </Link>
          <Link to="/ReelsFeed" className="nav-link font-bold">
          ReelsFeed
          </Link>
          <Link to="/profile" className="nav-link font-bold">
            Profile
          </Link>
          <Link to="/postadd" className="nav-link font-bold">
            Create Post
          </Link>
          <Link to="/Createreel" className="nav-link font-bold">
            Create Reel
          </Link>
          <Link to="/followingposts" className="nav-link ml-4 font-bold">
            My Following
          </Link>
          <button
            className="primary-btn ml-4 font-bold"
            onClick={() => setModalOpen(true)}
          >
            Log Out
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signup" className="nav-link font-bold">
            Sign Up
          </Link>
          <Link to="/signin" className="nav-link font-bold">
            Sign In
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="navbar bg-white shadow-md flex items-center justify-between px-6 py-4">
      <img src={logo} alt="Logo" className="w-25 h-20" />
      <div className="flex items-center space-x-6">{loginStatus()}</div>
    </nav>
  );
}
