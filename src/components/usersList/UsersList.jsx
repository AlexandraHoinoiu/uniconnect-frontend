import './usersList.css'
import { Link } from "react-router-dom"


export default function UsersList({ user }) {
    const refreshPage = () => {
        setTimeout(() => {
          window.location.reload(false);
        }, 100);
      }
    return (
        <Link to={`/profile/${user.type}/${user.id}`} onClick={refreshPage}>
            <li className="rightbarFriend">
                <div className="rightbarProfileImgContainer">
                    <img className="rightbarProfileImg" src={user.profileImg} alt="" />
                </div>
                {user.type === 'Learner' ?
                    <span className="rightbarUsername">{user.firstName} {user.lastName}</span>
                    :
                    <span className="rightbarUsername">{user.name}</span>
                }
            </li>
        </Link>
    );
}
