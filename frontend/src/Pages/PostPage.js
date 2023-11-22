import { formatISO9075 } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Fetch current post
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        setPostInfo(postInfo);

        // Fetch related posts based on the current post's title or category
        if (postInfo) {
          fetchRelatedPosts(postInfo.title, postInfo.category);
        }
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
      });
  }, [id]);

  const fetchRelatedPosts = async (title, category) => {
    try {
      // Fetch related posts based on title or category
      const response = await axios.get(`http://localhost:4000/related-posts?title=${title}&category=${category}`);
      
      // Exclude the current post from the related posts
      const filteredRelatedPosts = response.data.filter(relatedPost => relatedPost._id !== id);
      
      setRelatedPosts(filteredRelatedPosts);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  if (!postInfo) return '';

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/download-mp4/${postInfo._id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${postInfo.title}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <div className="author-time">
        <div className="author"> Published by {postInfo.author.username}</div>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      </div>
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      <button className="download_btn" onClick={handleDownload}>Download MP4</button>
      <div className="related-post">
        <h2>Related Posts</h2>
        <div className="related-post-grid">
          {relatedPosts.map(relatedPost => (
            <div key={relatedPost._id} className="related-post-item">
              <Link to={`/post/${relatedPost._id}`}>
                <img src={`http://localhost:4000/${relatedPost.cover}`} alt="" />
                <h3>{relatedPost.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
