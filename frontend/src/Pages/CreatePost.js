import React, { useState, useEffect } from "react";
import Editor from "../Editor";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router";
import axios from 'axios';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [picture, setPicture] = useState(null);
    const [mp4File, setMp4File] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handlePictureChange = (e) => {
        setPicture(e.target.files[0]);
    };

    const handleMp4FileChange = (e) => {
        setMp4File(e.target.files[0]);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);  
    };
    

    const createNewPost = async (ev) => {
        ev.preventDefault();
    
        // Check if the category is selected
        if (!selectedCategory) {
            alert('Please select a category before creating the post.');
            return;
        }
    
        const data = new FormData();
        data.append('title', title);
        data.append('summary', summary);
        data.append('content', content);
        data.append('cover', picture);  
        data.append('mp4file', mp4File);  
        data.append('category', selectedCategory);
    
        try {
            const response = await axios.post('http://localhost:4000/post', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,  
            });
    
            if (response.status === 200) {
                setRedirect(true);
            }
        } catch (error) {
            console.error('Error creating post:', error.response); 
        }
    };
    

    useEffect(() => {
        // Fetch existing categories from the server
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:4000/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error.response); 
            }
        };

        fetchCategories();
    }, []);

    if (redirect) {
        return <Navigate to={'/AdminDashboard'} />;
    }

    return (
        <form className="editor_pad" onSubmit={createNewPost}>
            <input type="title" placeholder={'Title'} value={title} onChange={ev => setTitle(ev.target.value)} />
            <input type="summary" placeholder={'Summary'} value={summary} onChange={ev => setSummary(ev.target.value)} />
            <h2>Select post picture below</h2>
            <input type="file" accept="image/*" onChange={handlePictureChange} />
            <h2>Select movie file below</h2>
            <input type="file" accept=".mp4" onChange={handleMp4FileChange} />

            <div className="category-sec">
                <label htmlFor="category">Select Category:</label>
                <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                     <option value="">Select...</option>
                    {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                     ))}
                </select>
            </div>

            <Editor onChange={setContent} value={content} />
            <button type="submit" style={{ marginTop: '8px' }}>Create Post</button>
        </form>
    );
}
