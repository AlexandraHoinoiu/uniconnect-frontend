import "./closeFriend.css";

export default function CloseFriend({user}) {
  const public_folder = process.env.REACT_APP_PUBLIC_FOLDER

  return (
    <li className="sidebarFriend">
      <img className="sidebarFriendImg" src={public_folder + user.profilePicture} alt="" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}