import "./share.css";
import {PermMedia} from "@material-ui/icons"
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {

  const {user} = useContext(AuthContext)
  const text = useRef()
  const [file, setFile] = useState([])
  const [fileName, setFileName] = useState([])
  const [photo, setPhoto] = useState([])


  const handleFileRead = async (event) => {
    const file = event.target.files[0]
    setFileName(file.name)
    const base64 = await convertBase64(file)
    setFile(base64)
    displayPhoto(file.name, base64)
  }

  const displayPhoto = (name, img) => {
    const html = 
    <div>
      <hr className="firstHr"/>
      <div className="photoDisplay">
        <button className="removePhoto" onClick={removePhoto}>X</button>{name}
        <img className="photo" src={img} alt="img" />
      </div>
    </div>
    setPhoto(html)
  }

  const removePhoto = () => {
    setPhoto('')
    setFileName('')
    setFile(false)
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    const newPost = {
      type: user.type,
      userId: user.id,
      text: text.current.value
    }
    if(file) {
      newPost.dataFile = file;
      newPost.fileName = fileName;
    }
    try{
      await axios.post("http://api.local:9901/createPost", newPost)
      window.location.reload()
    } catch(err) {

    }
  }
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profileImg} alt="" />
          <input
            placeholder="Share something with your followers"
            className="shareInput"
            ref={text}
          />
        </div>
        {photo}
        <hr className="shareHr"/>
        <form className="shareBottom" onSubmit={submit}>
            <div className="shareOptions">
                <label htmlFor="file" className="shareOption">
                    <PermMedia htmlColor="tomato" className="shareIcon"/>
                    <span className="shareOptionText">Photo</span>
                    <input type="file" style={{display:"none"}} id="file" accept=".png,.jpeg,.jpg" onChange={handleFileRead}/>
                </label>
            </div>
            <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}