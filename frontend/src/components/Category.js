import React, { useState } from "react";
import { Link } from "react-router-dom"; // For linking profiles
import "./Category.css"; // Add any specific styling you need here

const Category = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [posts, setPosts] = useState([]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        // Fetch posts by category
        fetch(`http://localhost:5000/posts/category/${category}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setPosts(result); // Set filtered posts to state
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="category-container">
            {/* Category Selection */}
            <h2>Select Category</h2>
            <div className="category-buttons">
                <button
                    className={`category-button ${selectedCategory === "Sport" ? "selected" : ""}`}
                    onClick={() => handleCategorySelect("Sport")}
                >
                    Sport
                </button>
                <button
                    className={`category-button ${selectedCategory === "Cultural" ? "selected" : ""}`}
                    onClick={() => handleCategorySelect("Cultural")}
                >
                    Cultural
                </button>
            </div>

            {/* Display Filtered Posts */}
            <div className="posts-container">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="card">
                            {/* Card Header */}
                            <div className="card-header">
                                <div className="card-pic">
                                    <img src={post.postedBy.Photo || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"} alt="User" />
                                </div>
                                <h5>
                                    <Link to={`/profile/${post.postedBy._id}`}>
                                        {post.postedBy.name}
                                    </Link>
                                </h5>
                            </div>

                            {/* Card Image */}
                            <div className="card-image">
                                <img src={post.photo} alt="Post" />
                            </div>

                            {/* Card Content */}
                            <div className="card-content">
                                <p>{post.likes.length} Likes</p>
                                <p>{post.body}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No posts available for this category.</p>
                )}
            </div>
        </div>
    );
};

export default Category;
