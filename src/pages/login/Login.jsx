import "./login.css";
import { useRef, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useParams } from "react-router";


export default function Login() {
  const params = useParams();
  const anotherType = params.type === 'Learner' ? 'School' : 'Learner'
  const email = useRef()
  const password = useRef()
  const {user, isFetching, error, dispatch } = useContext(AuthContext);

  const submit = (e) => {
    e.preventDefault();
    const loginCall = async (userCredential, dispatch) => {
      dispatch({ type: "LOGIN_START" });
      try {
        const res = await axios.post("http://home.local:9901/signIn", userCredential);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err });
      }
    };
    loginCall(
      { email: email.current.value, password: password.current.value, type:params.type },
      dispatch
    );
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo"><img src="/assets/logo.png" alt="logo" /></h3>
          <span className="loginDesc">
          {params.type === 'Learner' ? 
          <span>Login page for <b>learners</b>. Login page for university/school&nbsp;
            <Link to={`${anotherType}`}>
             here
            </Link>.</span> : 
          <span>Login page for <b>university/school</b>. Login page for learners&nbsp;
            <Link to={`${anotherType}`}>
             here
            </Link>.</span>
          }
          </span>
        </div>
        <div className="loginRight" onSubmit={submit}>
          <form className="loginBox" autoComplete="nope">
          <h2 align="center">{params.type}</h2>
            <input placeholder="Email" type='email' className="loginInput" required ref={email} />
            <input placeholder="Password" className="loginInput"
              type='password' minLength='6' required ref={password} />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (<CircularProgress size="20px" />) : ("Log In")}
            </button>
            <Link to={`/register/${params.type}`}>
            <button className="loginRegisterButton">
              {isFetching ? (
                <CircularProgress size="20px" />
              ) : (
                "Create a New Account"
              )}
            </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}