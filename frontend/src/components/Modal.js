import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./Modal.css";

export default function Modal({ setModalOpen }) {
  const navigate = useNavigate();

  return (
    <div className="darkBg" onClick={() => setModalOpen(false)}>
      <div className="centered" onClick={(e) => e.stopPropagation()}> {/* Prevent closing on modal content click */}
        <div className="modal">
          {/* Modal header */}
          <div className="modalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button className="closeBtn" onClick={() => setModalOpen(false)}>
            <RiCloseLine />
          </button>
          {/* Modal content */}
          <div className="modalContent">Do you really want to log out ?</div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button
                className="logOutBtn"
                onClick={() => {
                  localStorage.removeItem("jwt"); // Remove the token
                  localStorage.clear(); // Clear all local storage
                  setModalOpen(false); // Close the modal (if applicable)
                  navigate("/signin"); // Redirect to the sign-in page
                  window.location.reload(); // Optional: Refresh the page if needed
                }}
              >
                Log Out
              </button>

              <button className="cancelBtn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
