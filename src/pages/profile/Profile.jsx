import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Profile() {
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src= {public_folder + "post/3.jpeg"}
                alt=""
              />
              <img
                className="profileUserImg"
                src={public_folder + "/person/7.jpeg"}
                alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">Safak Kocaoglu</h4>
                <span className="profileInfoDesc">Hello my friends!</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId = '1' type = 'Learner' section = 'profile'/>
            <Rightbar profile/>
          </div>
        </div>
      </div>
    </>
  );
}