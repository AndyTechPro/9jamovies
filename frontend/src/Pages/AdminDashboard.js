import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import { UserContext } from "../UserContext";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/post", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error("Error fetching posts:", error));

    fetch("http://localhost:4000/profile", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((userInfo) => {
        setUserInfo(userInfo);
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [setUserInfo]);

  const username = userInfo?.username;

  if (!username) {
    return <Navigate to="/AdminDashboard" />;
  }

  const handleCreateCategory = () => {
    // Send a request to create a new category
    fetch('http://localhost:4000/categories', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
      body: JSON.stringify({ name: newCategory }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the created category
        console.log('Category created successful', data);
        // Close the modal after category creation
        setShowCategoryModal(false);
      })
      .catch((error) => {
        console.error('Error creating category:', error);
      });
  };
  

  const fundelete = (id) => {
    if (window.confirm("Do you want to delete this post?")) {
      fetch(`http://localhost:4000/delete-post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload();
          } else {
            console.error("Failed to delete post:", response.status);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  return (
    <div className="container_admin">
      <div className="dashboard">
        <div className="headbar">
          <ul>
            <li>
              <Link className="admin_btn2" to="/">
                View Home
              </Link>
            </li>
            {username && (
              <>
                <li>
                  <Link className="admin_btn2" to="/create">
                    Create new post
                  </Link>
                </li>
              </>
            )}
            <li>
              <button
                className="admin_btn3"
                onClick={() => setShowCategoryModal(true)}
              >
                Categories creation
              </button>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <h2>Manage Posts</h2>
          <ul className="admin-posts">
            {posts.map((post) => (
              <li key={post._id}>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
                <div className="admin-post-controls">
                  <Link to={`/edit-post/${post._id}`} className="btn">
                    Edit
                  </Link>
                  <div className="delete">
                    <button
                      onClick={() => fundelete(post._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className="category-modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setShowCategoryModal(false)}
            >
              &times;
            </span>
            <h2>Create Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={handleCreateCategory}>Create Category</button>
          </div>
        </div>
      )}
    </div>
  );
}
