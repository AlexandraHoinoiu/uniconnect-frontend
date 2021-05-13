import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom"
import axios from "axios"


export default function Rightbar() {
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER
  const params = useParams();
  const [friends, setFriends] = useState([]);
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await axios.get(`http://profile.local:9902/user-following/${user.type}/${user.id}`);
      if (response.data.success === true) {
        setFriends(response.data.users)
      }
    }
    fetchFriends();
  }, []);

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
    return (
      <>
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Country/State:</span>
            <span className="rightbarInfoValue">{user.country}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">Following</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <div className="rightbarFollowing">
               <Link to={`profile/${friend.type}/${friend.id}`}>
                <img
                  src={friend.profileImg}
                  alt=""
                  className="rightbarFollowingImg"
                />
               </Link>
              <span className="rightbarFollowingName">{friend.firstName + " " + friend.lastName}</span>
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