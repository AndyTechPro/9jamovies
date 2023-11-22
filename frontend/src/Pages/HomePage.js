import React, { useEffect, useState } from "react";
import Post from "../Post";
import Header from "../header";
import Notice from '../Notice';
import LoadMore from '../loadMore';
import Search from '../Search';
import CategorySelection from '../CategorySelection';
import HomePage2 from "./HomePage2";
import Footer from "../footer";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadMorePosts = async () => {
    if (allPostsLoaded) {
      // No more posts to load, do nothing
      return;
    }

    const categoryParam = selectedCategory ? `&category=${selectedCategory}` : '';
    const response = await fetch(`http://localhost:4000/?page=${nextPage}${categoryParam}`);
    const data = await response.json();

    setPosts((prevPosts) => [...prevPosts, ...data.data]);
    setNextPage(data.nextPage);
    setAllPostsLoaded(data.nextPage === null);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setNextPage(1);
    setAllPostsLoaded(false);

    // Fetch posts based on the selected category
    const categoryParam = category ? `&category=${category}` : '';
    fetch(`http://localhost:4000/?page=1${categoryParam}`)
      .then(response => response.json())
      .then(data => {
        setPosts(data.data);
        setNextPage(data.nextPage);
        setAllPostsLoaded(data.nextPage === null);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    const categoryParam = selectedCategory ? `&category=${selectedCategory}` : '';
    fetch(`http://localhost:4000/?page=1${categoryParam}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching posts:', data.details);
            } else {
                setPosts(data.data);
                setNextPage(data.nextPage);
                setAllPostsLoaded(data.nextPage === null);
            }
        })
        .catch(error => console.error('Error fetching posts:', error));
}, [selectedCategory]);


  return (
    <main className="container">
      <Header />
      <div className="category-header">
        <CategorySelection onSelectCategory={handleCategoryChange} activeCategory={selectedCategory} />
      </div>
      <Notice />
      <Search />
      <h2>Latest Movies</h2>
      <div className="blog-container">
        {posts.length > 0 && posts.map(post => (
          <Post key={post._id} {...post} />
        ))}
      </div>
      <LoadMore nextPage={nextPage} loadMore={loadMorePosts} />
      <HomePage2 />
      <Footer />
    </main>
  );
}
