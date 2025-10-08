import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Home.css";

export default function Home() {
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }

    // Fetching all posts
    fetch("https://xenith.onrender.com/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Posts fetched:", result);
        setData(result);
      })
      .catch((err) => {
        console.log("Error fetching posts:", err);
        notifyA("Error loading posts");
      });
  }, [navigate]);

  // to show and hide comments
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
      setItem([]);
    } else {
      setShow(true);
      setItem(posts); // Set the current post to display comments
    }
  };

  const likePost = (id) => {
    fetch("https://xenith.onrender.com/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log("Like result:", result);
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        notifyB("Post liked");
      })
      .catch((err) => {
        console.error("Error liking post:", err);
        notifyA("Failed to like post");
      });
  };

  const unlikePost = (id) => {
    fetch("https://xenith.onrender.com/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log("Unlike result:", result);
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        notifyA("Post unliked");
      })
      .catch((err) => {
        console.error("Error unliking post:", err);
        notifyA("Failed to unlike post");
      });
  };

  // function to make comment
  const makeComment = (text, id) => {
    fetch("https://xenith.onrender.com/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log("Comment result:", result);
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("Comment posted");
      })
      .catch((err) => {
        console.error("Error posting comment:", err);
        notifyA("Failed to post comment");
      });
  };

  // Check if user exists in localStorage
  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user._id) {
        return user._id;
      }
      return null;
    } catch (err) {
      console.error("Error getting user ID:", err);
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  return (
    <div className="home">
      {/* card */}
      {data.map((posts) => {
        return (
          <div className="card" key={posts._id}>
            {/* card header */}
            <div className="card-header">
              <div className="card-pic">
                <img
                  src={posts.postedBy.Photo ? posts.postedBy.Photo : picLink}
                  alt="Profile"
                />
              </div>
              <h5>
                <Link to={`/profile/${posts.postedBy._id}`}>
                  {posts.postedBy.userName}
                </Link>
              </h5>
            </div>
            {/* card image */}
            <div className="card-image">
              <img src={posts.photo} alt="Post" />
            </div>

            {/* card content */}
            <div className="card-content">
              {currentUserId && posts.likes.includes(currentUserId) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}

              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all comments
              </p>
            </div>

            {/* add Comment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                className="comment"
                onClick={() => {
                  makeComment(comment, posts._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}

      {/* show Comment */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="Post" />
            </div>
            <div className="details">
              {/* card header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                    src={item.postedBy.Photo ? item.postedBy.Photo : picLink}
                    alt="Profile"
                  />
                </div>
                <h5>{item.postedBy.userName || item.postedBy.name}</h5>
              </div>

              {/* commentSection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments && item.comments.map((comment, index) => {
                  return (
                    <p className="comm" key={index}>
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {comment.postedBy.userName || comment.postedBy.name}{" "}
                      </span>
                      <span className="commentText">{comment.comment || comment.text}</span>
                    </p>
                  );
                })}
              </div>

              {/* card content */}
              <div className="card-content">
                <p>{item.likes ? item.likes.length : 0} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}