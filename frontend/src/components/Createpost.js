import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./Createpost.css";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false); // <-- Loading state
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (url) {
      fetch("https://xenith.onrender.com/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
          category,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false); // <-- Stop loading after post is created
          if (data.error) {
            notifyA(data.error);
          } else {
            notifyB("Successfully Posted");
            navigate("/");
          }
        })
        .catch((err) => {
          setLoading(false); // <-- Stop loading even if error
          console.log(err);
        });
    }
  }, [url, body, category, navigate]);

  const postDetails = () => {
    if (!body || !image || !category) {
      notifyA("Please add all the fields!");
      return;
    }
    setLoading(true); // <-- Start loading when share button clicked
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "apsit-circle");
    data.append("cloud_name", "apsitcirclecloud");
    fetch("https://api.cloudinary.com/v1_1/apsitcirclecloud/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((err) => {
        setLoading(false); // <-- Stop loading if image upload fails
        console.log(err);
      });
  };

  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

  return (
    <div className="createPost">
      {/* header */}
      <div className="post-header">
        <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
        <button id="post-btn" onClick={postDetails} disabled={loading}>
          {loading ? (
            <div className="loader"></div> // <-- Spinner while loading
          ) : (
            "Share"
          )}
        </button>
      </div>

      {/* Image preview */}
      <div className="main-div">
        <img
          id="output"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
          alt="Preview of the uploaded pic"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            loadfile(event);
            setImage(event.target.files[0]);
          }}
        />
      </div>

      {/* Category dropdown */}
      <div className="category-selection">
        <select className="form-control category-dropdown" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="" disabled>Select Category</option>
          <option value="Sport">Sports</option>
          <option value="Cultural">Cultural</option>
        </select>
      </div>

      {/* Post Caption */}
      <div className="details">
        <div className="card-header">
          <h5>Caption</h5>
        </div>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
          type="text"
          placeholder="Write a caption...."
        ></textarea>
      </div>
    </div>
  );
}
