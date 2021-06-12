import { useEffect, useState , useContext} from "react";
import Share from "../share/Share";
import "./feed.css";
import Post from "../post/Post"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"


export default function Feed({userId, type, section}) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext)
  useEffect(() => {
    const fetchPosts = async() => {
      const response = section === 'home'
      ? await axios.post("http://api.local:9901/posts", {
        type: type,
        userId: userId,
        page: 1
      }).catch(function (error){
      })
      : await axios.post("http://api.local:9902/posts", {
        type: type,
        userId: userId,
        page: 1
      }).catch(function (error){
      });
      if(typeof response !== 'undefined'){
        setPosts(response.data.data)
      }
    }
    fetchPosts();
  }, []);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {user.id == userId ? <Share /> : ""}
        {posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}