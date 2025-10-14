import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaHome, FaPlusCircle, FaSignOutAlt, FaThLarge, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import logo from "../img/logo.png";
import "./Navbar.css";

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState(() => {
    // Set initial active page based on current URL path
    const path = window.location.pathname;
    if (path === "/") return "home";
    if (path === "/category") return "category";
    if (path === "/profile") return "profile";
    if (path === "/createPost") return "createPost";
    if (path === "/followingpost") return "following";
    if (path === "/signin") return "signin";
    if (path === "/signup") return "signup";
    return "";
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === "/") setActivePage("home");
      else if (path === "/category") setActivePage("category");
      else if (path === "/profile") setActivePage("profile");
      else if (path === "/createPost") setActivePage("createPost");
      else if (path === "/followingpost") setActivePage("following");
      else if (path === "/signin") setActivePage("signin");
      else if (path === "/signup") setActivePage("signup");
    };

    window.addEventListener("popstate", handleLocationChange);

    // Initial check on component mount
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
          <Link to="/" onClick={() => setActivePage("home")}>
            <li className={activePage === "home" ? "nav-active" : ""}>
              <FaHome className="nav-icon" /> Home
            </li>
          </Link>
          <Link to="/category" onClick={() => setActivePage("category")}>
            <li className={activePage === "category" ? "nav-active" : ""}>
              <FaThLarge className="nav-icon" /> Categories
            </li>
          </Link>
          <Link to="/profile" onClick={() => setActivePage("profile")}>
            <li className={activePage === "profile" ? "nav-active" : ""}>
              <FaUser className="nav-icon" /> Profile
            </li>
          </Link>
          <Link to="/createPost" onClick={() => setActivePage("createPost")}>
            <li className={activePage === "createPost" ? "nav-active" : ""}>
              <FaPlusCircle className="nav-icon" /> Create Post
            </li>
          </Link>
          <Link to="/followingpost" onClick={() => setActivePage("following")}>
            <li className={activePage === "following" ? "nav-active" : ""}>
              <FaHeart className="nav-icon" /> Following
            </li>
          </Link>
          <button
            className="primaryBtn"
            onClick={() => {
              localStorage.removeItem("jwt");
              localStorage.clear();
              setModalOpen(false);
              navigate("/signin");
              window.location.reload();
            }}
          >
            <FaSignOutAlt className="nav-icon" /> Log Out
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signup" onClick={() => setActivePage("signup")}>
            <li className={activePage === "signup" ? "nav-active" : ""}>Sign Up</li>
          </Link>
          <Link to="/signin" onClick={() => setActivePage("signin")}>
            <li className={activePage === "signin" ? "nav-active" : ""}>Sign In</li>
          </Link>
        </>
      );
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar">
      <img src={logo} alt="Logo" className="nav-logo" />
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`nav-menu ${isOpen ? "active" : ""}`}>{loginStatus()}</ul>
    </div>
  );
}