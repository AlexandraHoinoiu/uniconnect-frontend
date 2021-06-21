import "./rightbar.css";
import UsersList from "../usersList/UsersList";
import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom"
import axios from "axios"
import { Modal } from 'react-bootstrap'
import { CircularProgress } from "@material-ui/core";

export default function Rightbar(currentUser) {
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER
  const params = useParams();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [follow, setFollow] = useState('');
  const [modalbody, setModalbody] = useState('');
  const [profileFollowersModal, setProfileFollowersModal] = useState(false);
  const [modalFollowersTitle, setModalFollowersTitle] = useState('');
  const [modalFollowersBody, setModalFollowersBody] = useState('');
  const [suggestedUsersModal, setSuggestedUsersModal] = useState(false);
  const { user } = useContext(AuthContext)
  const limit = 6;

  useEffect(() => {
    const fetchFollowing = async () => {
      const response = await axios.get(`http://api.local:9902/user-following/${params.type}/${params.userId}/${limit}`)
        .catch(function (error) {
        });
      if (typeof response !== 'undefined' && response.data.success === true) {
        setFollowing(response.data.users)
      }
    }

    const fetchFollowers = async () => {
      const response = await axios.get(`http://api.local:9902/user-followers/${params.type}/${params.userId}/${limit}`)
        .catch(function (error) {
        });
      if (typeof response !== 'undefined' && response.data.success === true) {
        setFollowers(response.data.users)
      }
    }

    const fetchSuggestedFriends = async () => {
      const response = await axios.get(`http://api.local:9902/suggested-users/${user.type}/${user.email}/10`)
        .catch(function (error) {
        });
      if (typeof response !== 'undefined' && response.data.success === true) {
        setSuggested(response.data.users)
      }
    }

    if (params.type) {
      fetchFollowing();
      fetchFollowers();
    } else {
      fetchSuggestedFriends();
    }
  }, []);

  const followCheck = async () => {
    const response = await axios.post(`http://api.local:9902/checkUserFollow`,
      {
        followerEmail: user.email,
        followedEmail: currentUser.user.email,
        followerType: user.type,
        followedType: currentUser.type

      })
      .catch(function (error) {
      });
    if (typeof response !== 'undefined' && response.data.success === true) {
      if (response.data.followed === true) {
        setFollow('Unfollow')
      } else {
        setFollow('Follow')
      }
    }
  }

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }

  const showAllSuggestedUsers = () => {
    setSuggestedUsersModal(true);
    setModalbody(<CircularProgress size="40px" />)
    const suggestedUsersCall = async () => {
      const response = await axios.get(`http://api.local:9902/suggested-users/${user.type}/${user.email}`)
      if (typeof response !== 'undefined' && response.data.success === true) {
        const html = response.data.users.map((u) => (
          <UsersList key={u.id} user={u} />
        ))
        setModalbody(html)
      } else {
        setModalbody(response.data.message)
      }
    }
    suggestedUsersCall();
  }

  const handleCloseSuggestedUsersModal = () => {
    setSuggestedUsersModal(false);
  }

  const handleCloseProfileFollowersModal = () => {
    setProfileFollowersModal(false);
    setModalFollowersBody('');
    setModalFollowersTitle('');
  }

  const showFollowerModal = (e) => {
    const type = e.target.id;
    setModalFollowersTitle(type.charAt(0).toUpperCase() + type.slice(1));
    setModalFollowersBody(<CircularProgress size="50px" />);
    setProfileFollowersModal(true);
    if (type == 'following') {
      const call = async () => {
        const response = await axios.get(`http://api.local:9902/user-following/${params.type}/${params.userId}`);
        if (response.data.success === true) {
          const html = response.data.users.map((u) => (
            <UsersList key={u.id} user={u} />
          ))
          setModalFollowersBody(html)
        }
      }
      call();
    } else {
      const call = async () => {
        const response = await axios.get(`http://api.local:9902/user-followers/${params.type}/${params.userId}`);
        if (response.data.success === true) {
          const html = response.data.users.map((u) => (
            <UsersList key={u.id} user={u} />
          ))
          setModalFollowersBody(html)
        }
      }
      call();
    }
  }

  const followHandler = async () => {
    if (follow === 'Follow') {
      const response = await axios.post(`http://api.local:9902/follow`,
        {
          followerEmail: user.email,
          followedEmail: currentUser.user.email,
          followerType: user.type,
          followedType: currentUser.type

        });
      if (response.data.success === true) {
        setFollow('Unfollow')
      }
    } else {
      const response = await axios.post(`http://api.local:9902/unfollow`,
        {
          followerEmail: user.email,
          followedEmail: currentUser.user.email,
          followerType: user.type,
          followedType: currentUser.type

        });
      if (response.data.success === true) {
        setFollow('Follow')
      }
    }
  }

  const HomeRightbar = () => {
    return (
      <>
        <img className="rightbarAd" src={public_folder + "ad.png"} alt="" />
        <h4 className="rightbarTitle">Suggestions for you</h4>
        <ul className="rightbarFriendList">
          {suggested.map((u) => (
            <UsersList key={u.id} user={u} />
          ))}
        </ul>
        {suggested.length === 10 ?
          <button className="btn btn-outline-secondary" onClick={showAllSuggestedUsers}>
            View More
          </button> : ''
        }

        <Modal show={suggestedUsersModal} onHide={handleCloseSuggestedUsersModal} className="modalSuggested">
          <Modal.Header closeButton>Suggested Users</Modal.Header>
          <Modal.Body className="modalSuggestedBody">
            {modalbody}
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const ProfileRightbar = () => {
    if (user.type !== params.type || user.id !== parseInt(params.userId)) {
      followCheck();
    }
    return (
      <>
        {(user.type !== params.type || user.id !== parseInt(params.userId)) ?
          <button className="followButton" onClick={followHandler}>{follow}</button> : ''
        }
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Country/State:</span>
            <span className="rightbarInfoValue">{currentUser.user.country}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City</span>
            <span className="rightbarInfoValue">{currentUser.user.city}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">Following</h4>
        <div className="rightbarFollowings">
          {following.map((friend, index) => (
            <Link to={`/profile/${friend.type}/${friend.id}`} onClick={refreshPage}>
              <div className="rightbarFollowing" key={index}>
                <img
                  src={friend.profileImg}
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">
                  {friend.type === 'Learner' ? friend.firstName + " " + friend.lastName : friend.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
          {following.length === limit ?
            <button className="btn btn-outline-secondary" id="following" onClick={showFollowerModal}>
              View More
            </button> : ""
          }
        <br/><br/>
        <h4 className="rightbarTitle">Followers</h4>
        <div className="rightbarFollowings">
          {followers.map((friend, index) => (
            <Link to={`/profile/${friend.type}/${friend.id}`} onClick={refreshPage}>
              <div className="rightbarFollowing" key={'f' + index}>
                <img
                  src={friend.profileImg}
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">
                  {friend.type === 'Learner' ? friend.firstName + " " + friend.lastName : friend.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
          {followers.length === limit ?
            <button className="btn btn-outline-secondary" id="followers" onClick={showFollowerModal}>
              View More
            </button> : ""
          }

        <Modal show={profileFollowersModal} onHide={handleCloseProfileFollowersModal} className="modalSuggested">
          <Modal.Header closeButton>{modalFollowersTitle}</Modal.Header>
          <Modal.Body className="modalSuggestedBody">
            {modalFollowersBody}
          </Modal.Body>
        </Modal>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {params.type ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}