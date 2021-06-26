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
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textInfoModal, setTextInfoModal] = useState('');
  const [reportBody, setReportBody] = useState('');
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER
  const { user } = useContext(AuthContext)
  const newText = useRef();
  let reportType;


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
    const response = await axios.get("http://api.local:9901/like/" + post.id);
      if (response.data.success === true) {
        setLikes(likes + 1)
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

  const submitReport = (e) => {
    setReportBody(<CircularProgress size="40px" />)
    const call = async (reportType) => {
      const respose = await axios.post("http://api.local:9901/reportPost", {
        type: user.type,
        userId: user.id,
        postId: post.id,
        reportType: reportType
      });
      if (respose.data.success === true) {
        setReportBody('Thank you for your reporting!');
      } else {
        setTextInfoModal('Reporting could not be done.')
        handleCloseReportModal();
        setInfoModal(true);
      }
    }
    call(reportType);
  }

  const handleShowReportModal = () => {
    const html =
      <div>
        <div>
          Why are you reporting this post?
        </div>
        <div onChange={getReportType}>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="report" id="option1" value="Violence" />
            <label className="form-check-label" htmlFor="option1">
              Violence
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="report" id="option2" value="Sexual content" />
            <label className="form-check-label" htmlFor="option2">
              Sexual content
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="report" id="option3" value="Offensive content" />
            <label className="form-check-label" htmlFor="option3">
              Offensive content
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="report" id="option4" value="Spam" />
            <label className="form-check-label" htmlFor="option4">
              Spam
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="report" id="option5" value="False information" />
            <label className="form-check-label" htmlFor="option5">
              False information
            </label>
          </div>
        </div>
        <br />
        <button className="btn btn-info" type='submit'  onClick={submitReport}>Submit</button>
      </div>

    setReportBody(html);
    setReportModal(true);
  }
  const handleCloseReportModal = () => {
    setReportModal(false);
    setReportBody('');
  }

  const handleCloseDeleteModal = () => setDeleteModal(false);
  const handleShowDeleteModal = () => setDeleteModal(true);
  const handleCloseInfoModal = () => setInfoModal(false);
  const handleCloseEditModal = () => setEditModal(false);
  const handleShowEditModal = () => setEditModal(true);
  const getReportType = (e) => {
    reportType = e.target.value;
  }

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
                  <Dropdown.Item onClick={handleShowReportModal}> Report the post</Dropdown.Item>
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

      <Modal show={reportModal} onHide={handleCloseReportModal}>
        <Modal.Header closeButton><h4>Report the post</h4></Modal.Header>
        <Modal.Body>
          {reportBody}
        </Modal.Body>
      </Modal>

      <Modal show={infoModal} onHide={handleCloseInfoModal}>
        <Modal.Header closeButton>Error</Modal.Header>
        <Modal.Body className="text-danger">{textInfoModal}</Modal.Body>
      </Modal>
    </div>
  );
}