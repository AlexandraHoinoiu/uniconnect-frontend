import { useEffect, useState } from "react";
import Share from "../share/Share";
import "./feed.css";
import Post from "../post/Post"
import axios from "axios"


export default function Feed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async() => {
      const response = await axios.post("http://home.local:9901/posts", {
        type: 'Learner',
        userId: 1,
        page: 1
      });
      setPosts(response.data.data)
    }
    fetchPosts();
  }, []);
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((p, index) => (
          <Post key={index} post={p} />
        ))}
      </div>
    </div>
  );
}