import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import logo from "../img/logo.png";
import "./Navbar.css";

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/category">
            <li>Category</li>
          </Link>
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link to="/createPost">
            <li>Create Post</li>
          </Link>
          <Link to="/followingpost">
            <li>My Following</li>
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
            Log Out
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signup">
            <li>Sign Up</li>
          </Link>
          <Link to="/signin">
            <li>Sign In</li>
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
      <img src={logo} alt="Logo" />
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`nav-menu ${isOpen ? "active" : ""}`}>{loginStatus()}</ul>
    </div>
  );
}
