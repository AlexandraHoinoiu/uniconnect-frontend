import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { CircularProgress } from "@material-ui/core";
import { AuthContext } from "../../context/AuthContext"
import { Modal } from 'react-bootstrap'



export default function Profile() {
  const [profileUser, setProfileUser] = useState({})
  const params = useParams();
  const { user } = useContext(AuthContext)
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [file, setFile] = useState([])
  const [fileName, setFileName] = useState([])
  const [photo, setPhoto] = useState([])
  const [textInfoModal, setTextInfoModal] = useState('');
  const [infoModal, setInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      const response =
        await axios.get('http://api.local:9902/user/' + params.type + '/' + params.userId)
          .catch(function (error) {
          });
      if (typeof response !== 'undefined' && response.data.success === true) {
        setProfileUser(response.data.user)
      }
    }
    fetchUser()
  }, [])

  const changeCoverImg = () => {
    if (params.type === user.type && user.id === parseInt(params.userId)) {
      setModalTitle('cover')
      setModal(true)
    }
  }
  const changeProfileUserImg = () => {
    if (params.type === user.type && user.id === parseInt(params.userId)) {
      setModalTitle('profile')
      setModal(true)
    }
  }

  const savePhoto = async () => {
    setLoading(true)
    const response = await axios.post("http://api.local:9902/user/changePhoto",
      {
        userId: user.id,
        type: user.type,
        fileName: fileName,
        dataFile: file,
        photoType: modalTitle
      }
    )
    if (response.data.success === true) {
      handleCloseModal()
      if (modalTitle === 'profile') {
        const newUser = JSON.parse(localStorage.getItem("user"))
        newUser.profileImg = response.data.link;
        localStorage.setItem("user", JSON.stringify(newUser))
      } else {
        const newUser = JSON.parse(localStorage.getItem("user"))
        newUser.coverImg = response.data.link;
        localStorage.setItem("user", JSON.stringify(newUser))
      }
      window.location.reload()
    } else {
      setLoading(false)
      handleCloseModal()
      setTextInfoModal(response.data.message)
      setInfoModal(true)
    }
  }

  const handleCloseInfoModal = () => setInfoModal(false);


  const handleFileRead = async (event) => {
    const file = event.target.files[0]
    setFileName(file.name)
    const base64 = await convertBase64(file)
    setFile(base64)
    displayPhoto(file.name, base64)
  }


  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const displayPhoto = (name, img) => {
    const html =
      <div>
        <img className="photo" src={img} alt="img" />
      </div>
    setPhoto(html)
  }

  const handleCloseModal = () => {
    setModal(false)
    setPhoto('')
    setFileName('')
    setFile('')
  }

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profileRight">
          <div className="profileCover">
            <img
              className="profileCoverImg"
              src={profileUser.coverImg}
              alt=""
              onClick={changeCoverImg}
            />
            <img
              className="profileUserImg"
              src={profileUser.profileImg}
              alt=""
              onClick={changeProfileUserImg}
            />
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">
              {profileUser.hasOwnProperty('firstName') ? profileUser.firstName + " " + profileUser.lastName : profileUser.name}
            </h4>
            <span className="profileInfoDesc">
              {profileUser.hasOwnProperty('description') ? profileUser.description : ''}
            </span>
          </div>

          <div className="profileRightBottom">
            <Feed userId={parseInt(params.userId)} type={params.type} section='profile' />
            <Rightbar user={profileUser} type={params.type} />
          </div>
        </div>
      </div>

      <Modal show={modal} onHide={handleCloseModal}>
        {!loading ?
          <div>
            <Modal.Header className="text-center" closeButton>
              Change {modalTitle} picture
            </Modal.Header>
            <Modal.Body>
              <input type="file" id="file" accept=".png,.jpeg,.jpg" onChange={handleFileRead} />
              {photo}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={savePhoto} className="btn btn-primary">
                Save
              </button>
              <button onClick={handleCloseModal} className="btn btn-danger">
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
    </>
  );
}