import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios"
import { format } from "timeago.js"
import { Link } from "react-router-dom"
import { Dropdown, Modal } from 'react-bootstrap'
import { AuthContext } from "../../context/AuthContext"

export default function Post({ post }) {
  const [likes, setLikes] = useState(post.likes)
  const [text, setText] = useState(post.text)
  const [userPost, setUserPost] = useState({})
  const [isLiked, setIsLiked] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textInfoModal, setTextInfoModal] = useState('');
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER
  const { user } = useContext(AuthContext)
  const newText = useRef()


  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("http://api.local:9901/post/user/" + post.id)
      if (response.data.success === true) {
        setUserPost(response.data.user)
      }
    }
    fetchUser();
  }, [post.id])

  const likeHandler = async () => {
    if (!isLiked) {
      const response = await axios.get("http://api.local:9901/like/" + post.id);
      if (response.data.success === true) {
        setLikes(likes + 1)
      }
    } else {
      const response = await axios.get("http://api.local:9901/remove-like/" + post.id);
      if (response.data.success === true) {
        setLikes(likes - 1)
      }
    }
  }

  const handleDeletePost = async () => {
    setLoading(true)
    const response = await axios.post("http://api.local:9901/deletePost", { postId: post.id });
    if (response.data.success === true) {
      setLoading(false)
      setDeleteModal(false)
      window.location.reload()
    } else {
      setLoading(false)
      setDeleteModal(false)
      setTextInfoModal('The post could not be deleted!')
      setInfoModal(true)
    }
  }

  const handleEditPost = (e) => {
    e.preventDefault();
    setLoading(true)
    const editCall = async (newDesc) => {
      const response = await axios.post("http://api.local:9901/editPost",
        {
          postId: post.id,
          text: newDesc
        }
      )
      if (response.data.success === true) {
        setText(newDesc)
        setLoading(false)
        setEditModal(false)
      } else {
        setLoading(false)
        setEditModal(false)
        setTextInfoModal('The post could not be edited!')
        setInfoModal(true)
      }
    }
    editCall(newText.current.value)
  }

  const handleCloseDeleteModal = () => setDeleteModal(false);
  const handleShowDeleteModal = () => setDeleteModal(true);
  const handleCloseInfoModal = () => setInfoModal(false);
  const handleCloseEditModal = () => setEditModal(false);
  const handleShowEditModal = () => setEditModal(true);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${userPost.type}/${userPost.id}`}>
              <img
                className="postProfileImg"
                src={userPost.profileImg}
                alt=""
                title={userPost.type === 'School' ? userPost.name : userPost.firstName + ' ' + userPost.lastName}
              />
            </Link>
            <span className="postUsername">
              {userPost.type === 'School' ? userPost.name : userPost.firstName}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown">
                <MoreVert />
              </Dropdown.Toggle>

              {user.id === userPost.id ?
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleShowEditModal}>
                    Edit the post
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleShowDeleteModal}>
                    Delete the post
                  </Dropdown.Item>
                </Dropdown.Menu>
                :
                <Dropdown.Menu>
                  <Dropdown.Item> Report the post</Dropdown.Item>
                </Dropdown.Menu>
              }
            </Dropdown>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{text}</span>
          {post.imgPath !== "" ? <img className="postImg" src={post.imgPath} alt="" /> : ''}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={public_folder + "like.png"} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{likes}</span>
          </div>
          {/* <div className="postBottomRight">
            <span className="postCommentText">{post.comment || 0} comments</span>
          </div> */}
        </div>
      </div>
      <Modal show={deleteModal} onHide={handleCloseDeleteModal}>
        {!loading ?
          <div>
            <Modal.Body>Do you want to delete this post?</Modal.Body>
            <Modal.Footer>
              <button onClick={handleDeletePost} className="btn btn-danger">
                YES
              </button>
              <button onClick={handleCloseDeleteModal} className="btn btn-primary">
                NO
              </button>
            </Modal.Footer>
          </div>
          :
          <Modal.Body className="text-center"><CircularProgress size="40px" /></Modal.Body>
        }
      </Modal>

      <Modal show={editModal} onHide={handleCloseEditModal}>
        {!loading ?
          <div>
            <Modal.Header className="text-center" closeButton>
              Edit post description
            </Modal.Header>
            <Modal.Body>
              <textarea type='text' className="newTextInput" ref={newText} defaultValue={text}>
              </textarea>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={handleEditPost} className="btn btn-primary">
                Save
              </button>
              <button onClick={handleCloseEditModal} className="btn btn-danger">
                Close
              </button>
            </Modal.Footer>
          </div>
          :
          <Modal.Body className="text-center"><CircularProgress size="40px" /></Modal.Body>
        }
      </Modal>

      <Modal show={infoModal} onHide={handleCloseInfoModal}>
        <Modal.Header closeButton>Error</Modal.Header>
        <Modal.Body className="text-danger">{textInfoModal}</Modal.Body>
      </Modal>
    </div>
  );
}