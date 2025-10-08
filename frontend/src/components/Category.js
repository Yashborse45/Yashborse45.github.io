import { faFootballBall, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Category.css";

const Category = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [posts, setPosts] = useState([]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        // Fetch posts by category
        fetch(`https://xenith.onrender.com/posts/category/${category}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setPosts(result);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchPosts(selectedCategory, selectedSubCategory);
        }
    }, [selectedCategory, selectedSubCategory]);

    return (
        <div className="category-container">
            {/* Category Selection */}
            <h2>Select Category</h2>
            <div className="category-buttons">
                <button
                    className={`category-button ${selectedCategory === "Sport" ? "selected" : ""}`}
                    onClick={() => handleCategorySelect("Sport")}
                >
                    <FontAwesomeIcon icon={faFootballBall} size="lg" /> Sports
                </button>
                <button
                    className={`category-button ${selectedCategory === "Cultural" ? "selected" : ""}`}
                    onClick={() => handleCategorySelect("Cultural")}
                >
                    <FontAwesomeIcon icon={faMicrophone} size="lg" /> Cultural
                </button>
            </div>

            {/* Subcategory Selection for Sports */}
            {selectedCategory === "Sport" && (
                <div className="subcategory-buttons">
                    <h4>Select Subcategory</h4>
                    {["Football", "Cricket", "Kabaddi", "Badminton", "Table Tennis", "Volleyball", "Chess", "Others"].map((subCat) => (
                        <button
                            key={subCat}
                            className={`subcategory-button ${selectedSubCategory === subCat ? "selected" : ""}`}
                            onClick={() => handleSubCategorySelect(subCat)}
                        >
                            {subCat}
                        </button>
                    ))}
                </div>
            )}

            {/* Display Posts */}
            <div className="posts-container">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="card">
                            {/* Card Header */}
                            <div className="card-header">
                                <div className="card-pic">
                                    <img
                                        src={post.postedBy.Photo || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"}
                                        alt="User"
                                    />
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
                                <p><strong>{post.likes.length} Likes</strong></p>
                                <p>{post.body}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="posts-container" style={{ display: 'block' }}>
                        <div className="no-posts-message">
                            No posts available for this category.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;
