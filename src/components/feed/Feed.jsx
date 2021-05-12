import { useEffect, useState } from "react";
import Share from "../share/Share";
import "./feed.css";
import Post from "../post/Post"
import axios from "axios"


export default function Feed({userId, type, section}) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async() => {
      const response = section === 'home'
      ? await axios.post("http://home.local:9901/posts", {
        type: type,
        userId: userId,
        page: 1
      }) 
      : await axios.post("http://home.local:9901/posts", {
        type: type,
        userId: userId,
        page: 1
      }) ;
      setPosts(response.data.data)
    }
    fetchPosts();
  }, []);
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}