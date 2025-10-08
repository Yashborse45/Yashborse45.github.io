import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./PostDetail.css";

export default function PostDetail({ item, toggleDetails }) {
  const navigate = useNavigate();
  const [postUser, setPostUser] = useState("");
  // Default profile pic link
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  // Fetch user data for the post
  useEffect(() => {
    if (item && item.postedBy && item.postedBy._id) {
      fetch(`http://localhost:5000/user/${item.postedBy._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.user) {
            setPostUser(result.user);
          }
        })
        .catch(err => console.log(err));
    }
  }, [item]);

  const removePost = (postId) => {
    if (window.confirm("Do you really want to delete this post ?")) {
      fetch(`https://xenith.onrender.com/deletePost/${postId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          toggleDetails();
          navigate("/");
          notifyB(result.message);
        });
    }
  };

  return (
    <div className="showComment">
      <div className="container">
        <div className="postPic">
          <img src={item.photo} alt="" />
        </div>
        <div className="details">
          {/* card header */}
          <div
            className="card-header"
            style={{ borderBottom: "1px solid #00000029" }}
          >
            <div className="card-pic">
              <img
                src={postUser && postUser.Photo ? postUser.Photo : picLink}
                alt="Profile"
              />
            </div>
            <h5>{item.postedBy.userName}</h5>
            <div
              className="deletePost"
              onClick={() => {
                removePost(item._id);
              }}
            >
              <span className="material-symbols-outlined">delete</span>
            </div>
          </div>

          {/* commentSection */}
          <div
            className="comment-section"
            style={{ borderBottom: "1px solid #00000029" }}
          >
            {item.comments.map((comment) => {
              return (
                <p className="comm" key={comment._id}>
                  <span className="commenter" style={{ fontWeight: "bolder" }}>
                    {comment.postedBy.name}{" "}
                  </span>
                  <span className="commentText">{comment.comment}</span>
                </p>
              );
            })}
          </div>

          {/* card content */}
          <div className="card-content">
            <p>{item.likes.length} Likes</p>
            <p>{item.body}</p>
          </div>

          {/* add Comment */}
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input
              type="text"
              placeholder="Add a comment"
            //   value={comment}
            //   onChange={(e) => {
            //     setComment(e.target.value);
            //   }}
            />
            <button
              className="comment"
            //   onClick={() => {
            //     makeComment(comment, item._id);
            //     toggleComment();
            //   }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      <div
        className="close-comment"
        onClick={() => {
          toggleDetails();
        }}
      >
        <span className="material-symbols-outlined material-symbols-outlined-comment">
          close
        </span>
      </div>
    </div>
  );
}