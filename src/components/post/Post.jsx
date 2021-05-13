import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useState, useEffect } from "react";
import axios from "axios"
import { format } from "timeago.js"
import { Link } from "react-router-dom"


export default function Post({ post }) {
  const [likes, setLikes] = useState(post.likes)
  const [dislikes, setDislikes] = useState(post.dislikes)
  const [user, setUser] = useState({})
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDiliked] = useState(false)
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("http://home.local:9901/post/user/" + post.id)
      if (response.data.success === true) {
        setUser(response.data.user)
      }
    }
    fetchUser();
  }, [post.id])

  const likeHandler = async () => {
    if (!isLiked) {
      const response = await axios.get("http://home.local:9901/like/" + post.id);
      if (response.data.success === true) {
        setLikes(likes + 1)
      }
    } else {
      const response = await axios.get("http://home.local:9901/remove-like/" + post.id);
      if (response.data.success === true) {
        setLikes(likes - 1)
      }
    }
  }
  // const dislikeHandler = async () => {
  //   if (!isDisliked) {
  //     const response = await axios.get("http://home.local:9901/dislike/" + post.id);
  //     if (response.data.success === true) {
  //       if (isLiked) {
  //         axios.get("http://home.local:9901/remove-like/" + post.id)
  //       }
  //       setDislikes(dislikes + 1)
  //       setIsDiliked(true)
  //     }
  //   } else {
  //     const response = await axios.get("http://home.local:9901/remove-dislike/" + post.id);
  //     if (response.data.success === true) {
  //       setDislikes(dislikes - 1)
  //       setIsDiliked(false)
  //     }
  //   }
  // }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.type}/${user.id}`}>
              <img
                className="postProfileImg"
                src={user.profileImg}
                alt=""
                title={user.type === 'School' ? user.name : user.firstName + ' ' + user.lastName}
              />
            </Link>
            <span className="postUsername">
              {user.type === 'School' ? user.name : user.firstName}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.text}</span>
          {post.imgPath !== ""? <img className="postImg" src={post.imgPath} alt="" /> : ''}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={public_folder + "like.png"} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{likes}</span>
            {/* <img className="likeIcon" src={public_folder + "dislike.png"} onClick={dislikeHandler} alt="" />
            <span className="postLikeCounter">{dislikes}</span> */}
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment || 0} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}