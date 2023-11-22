import React, { useEffect, useState } from "react";
import Post from "../Post";
import LoadMore from '../loadMore';

export default function HomePage2() {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);

  const loadMorePosts = async () => {
    if (allPostsLoaded) {
      // No more posts to load, do nothing
      return;
    }

    const response = await fetch(`http://localhost:4000/homepage2?page=${nextPage}`);
    const data = await response.json();

    // Sort posts by views in descending order
    const sortedPosts = data.data.sort((a, b) => b.views - a.views);

    // Filter out posts that are already present in the state
    const uniquePosts = sortedPosts.filter(post => !posts.some(p => p._id === post._id));

    setPosts((prevPosts) => [...prevPosts, ...uniquePosts]);
    setNextPage(data.nextPage);
    setAllPostsLoaded(data.nextPage === null);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch(`http://localhost:4000/homepage2?page=1`);
    const data = await response.json();

    // Sort posts by views in descending order
    const sortedPosts = data.data.sort((a, b) => b.views - a.views);

    setPosts(sortedPosts);
    setNextPage(data.nextPage);
    setAllPostsLoaded(data.nextPage === null);
  };

  return (
    <main className="container">
      <h2>Most Viewed Movies</h2>
      <div className="blog-container">
        {posts.length > 0 && posts.map(post => (
          <Post key={post._id} {...post} />
        ))}
      </div>
      <LoadMore nextPage={nextPage} loadMore={loadMorePosts} />
    </main>
  );
}
