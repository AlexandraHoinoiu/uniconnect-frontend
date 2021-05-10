import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useState, useEffect } from "react";
import axios from "axios"


export default function Post({ post }) {
  const [like,setLike] = useState(post.like)
  const [isLiked,setIsLiked] = useState(false)
  const [user,setUSer] = useState({})

  const likeHandler =()=>{
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    const fetchPosts = async() => {
      const response = await axios.post("http://home.local:9901/posts", {
        type: 'Learner',
        userId: 1,
        page: 1
      });
      setUSer(response.data.data)
    }
    fetchPosts();
  }, []);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            {/* <img
              className="postProfileImg"
              src={public_folder + Users.filter((u) => u.id === post?.userId)[0].profilePicture}
              alt=""
            />
            <span className="postUsername">
              {Users.filter((u) => u.id === post?.userId)[0].username}
            </span> */}
            <span className="postDate">{post.updatedAt}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.text}</span>
          <img className="postImg" src={post.imgPath} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={public_folder+"like.png"} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{post.likes}</span>
            <img className="likeIcon" src={public_folder+"dislike.png"} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{post.dislikes}</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}