import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {

  const {user} = useContext(AuthContext)
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Feed userId = {user.id} type = {user.type} section = 'home'/>
        <Rightbar user={user} type = {user.type} />
      </div>
    </>
  );
}