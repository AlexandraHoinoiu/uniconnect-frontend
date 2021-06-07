import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Profile() {
  const [user, setUser] = useState({})
  const params = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get('http://api.local:9902/user/' + params.type + '/' + params.userId)
      if (response.data.success === true) {
        setUser(response.data.user)
      }
    }
    fetchUser()
  }, [])

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverImg}
                alt=""
              />
              <img
                className="profileUserImg"
                src={user.profileImg}
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.hasOwnProperty('firstName') ? user.firstName + " " + user.lastName: user.name}</h4>
              <span className="profileInfoDesc">{user.hasOwnProperty('description')  ? user.description: ''}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId={params.userId} type={params.type} section='profile' />
            <Rightbar user={user} type={params.type} />
          </div>
        </div>
      </div>
    </>
  );
}