import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Feed userId = '1' type = 'Learner' section = 'home'/>
        <Rightbar/>
      </div>
    </>
  );
}