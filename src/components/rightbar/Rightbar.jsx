import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom"
import axios from "axios"


export default function Rightbar(currentUser) {
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER
  const params = useParams();
  const [friends, setFriends] = useState([]);
  const [follow, setFollow] = useState([]);
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await axios.get(`http://api.local:9902/user-following/${params.type}/${params.userId}`)
      .catch(function (error){
      });
      if (typeof response !== 'undefined' && response.data.success === true) {
        setFriends(response.data.users)
      }
    }
    fetchFriends();
  }, []);

  const followCheck = async () => {
    const response = await axios.post(`http://api.local:9902/checkUserFollow`, 
    {
      followerEmail: user.email,
      followedEmail: currentUser.user.email,
      followerType: user.type,
      followedType: currentUser.type

    })
    .catch(function (error){
    });
    if (typeof response !== 'undefined' && response.data.success === true) {
      if(response.data.followed === true) {
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
        {/* <div className="birthdayContainer">
          <img className="birthdayImg" src={public_folder + "gift.png"} alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div> */}
        <img className="rightbarAd" src={public_folder + "ad.png"} alt="" />
        <h4 className="rightbarTitle">Suggestions for you</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    followCheck()
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
          {friends.map((friend, index) => (
            <div className="rightbarFollowing" key={index}>
              <Link to={`/profile/${friend.type}/${friend.id}`} onClick={refreshPage}>
                <img
                  src={friend.profileImg}
                  alt=""
                  className="rightbarFollowingImg"
                />
              </Link>
              <span className="rightbarFollowingName">
                {friend.type === 'Learner' ? friend.firstName + " " + friend.lastName : friend.name}
              </span>
            </div>
          ))}
        </div>
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