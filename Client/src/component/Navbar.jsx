import React, { useState, useContext } from "react";
import logo from "../../public/logo.png";
import { Link } from "react-router-dom";
import { Authcontext } from "../context/Authcontext.js";
import { FaBars, FaTimes, FaHome, FaVideo, FaUser, FaPlusCircle, FaUsers } from "react-icons/fa"; // Importing icons

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(Authcontext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
          <Link to="/" className="nav-link font-bold flex items-center" onClick={() => setIsMenuOpen(false)}>
            <FaHome className="mr-2" /> Home
          </Link>
          <Link to="/ReelsFeed" className="nav-link font-bold flex items-center" onClick={() => setIsMenuOpen(false)}>
            <FaVideo className="mr-2" /> ReelsFeed
          </Link>
          <Link to="/profile" className="nav-link font-bold flex items-center" onClick={() => setIsMenuOpen(false)}>
            <FaUser className="mr-2" /> Profile
          </Link>
          <Link to="/postadd" className="nav-link font-bold flex items-center" onClick={() => setIsMenuOpen(false)}>
            <FaPlusCircle className="mr-2" /> Create Post
          </Link>
          <Link to="/Createreel" className="nav-link font-bold flex items-center" onClick={() => setIsMenuOpen(false)}>
            <FaPlusCircle className="mr-2" /> Create Reel
          </Link>
          <Link to="/followingposts" className="nav-link font-bold flex items-center" onClick={() => setIsMenuOpen(false)}>
            <FaUsers className="mr-2" /> My Following
          </Link>
          <button
  className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:from-purple-500 hover:to-red-500 transform hover:scale-105 transition-transform duration-300 ease-in-out"
  onClick={() => {
    setModalOpen(true);
    setIsMenuOpen(false); 
  }}
>
  Log Out
</button>

        </>
      );
    } else {
      return (
        <>
          <Link to="/signup" className="nav-link font-bold flex items-center" onClick={() => setIsMenuOpen(false)}>
            <FaUser className="mr-2" /> Sign Up
          </Link>
          <Link to="/signin" className="nav-link font-bold flex items-center" onClick={() => setIsMenuOpen(false)}>
            <FaUser className="mr-2" /> Sign In
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="navbar bg-white shadow-md flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-25 h-20" />
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6">{loginStatus()}</div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute top-0 left-0 w-full bg-white shadow-md md:hidden p-4 flex flex-col space-y-4`}
      >
        {loginStatus()}
      </div>
    </nav>
  );
}
