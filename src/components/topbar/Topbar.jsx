import "./topbar.css"
import { Search } from "@material-ui/icons"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

export default function Topbar() {

    const { user } = useContext(AuthContext)

    const logout = () => {
        localStorage.clear();
        window.location.reload()
    }
    const refreshPage = () => {
        setTimeout(() => {
            window.location.reload(false);
        }, 200);
    }
    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <div className="logo"><img src="/assets/logo.png" alt="logo" /></div>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className="searchIcon" />
                    <input placeholder="Search a friend or a school" className="searchInput" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topBarLinks">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <span className="topbarLink">Homepage</span>
                    </Link>
                </div>
                {/* <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Chat />
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">1</span>
                    </div>
                </div> */}
                <Link to={`/profile/${user.type}/${user.id}`} onClick={refreshPage}>
                    <img src={user.profileImg} alt="" className="topbarImg" />
                </Link>
            </div>
            <a className="logoutLink" onClick={logout}>Logout</a>
        </div>
    )
}
