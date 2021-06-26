import { useEffect, useState, useContext } from "react";
import Share from "../share/Share";
import "./feed.css";
import Post from "../post/Post"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
let page = 1;

export default function Feed({ userId, type, section }) {
  const [posts, setPosts] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const { user } = useContext(AuthContext)

  const fetchPosts = async () => {
    const response = section === 'home'
      ? await axios.post("http://api.local:9901/posts", {
        type: type,
        userId: userId,
        page: page
      }).catch(function (error) {
      })
      : await axios.post("http://api.local:9902/posts", {
        type: type,
        userId: userId,
        page: page
      }).catch(function (error) {
      });
    if (typeof response !== 'undefined') {
      if (page === 1) {
        setPosts(response.data.data);
      } else {
        setPosts([...posts, ...response.data.data])
      }
      if(response.data.data.length === 0)
      {
        setLoadMore(false)
      }
    }
  }

  useEffect(() => {
    page = 1;
    fetchPosts();
  }, []);

  const handleShowMorePosts = () => {
    page = page + 1;
    fetchPosts()
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {user.id === userId ? <Share /> : ""}
        {posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
    
        {loadMore ? 
            <button onClick={handleShowMorePosts} className="btn btn-outline-dark btn-lg">
            Load more posts
          </button>:
          <h4 className="text-info">No more posts! :( </h4>
          }
      </div>
    </div>
  );
}