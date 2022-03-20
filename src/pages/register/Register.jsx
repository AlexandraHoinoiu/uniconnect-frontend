import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { useParams } from "react-router";
import { Link } from "react-router-dom";


export default function Register() {
  const params = useParams();
  const anotherType = params.type === 'Learner' ? 'School' : 'Learner'
  const history = useHistory();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const nameSchool = useRef();
  const [errorMsg, setErrorMsg] = useState('');


  const submit = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      let user;
      if(params.type === 'Learner') {
        user = {
          last_name: lastName.current.value,
          first_name: firstName.current.value,
          email: email.current.value,
          password: password.current.value,
          type: params.type
        };
      } else {
        user = {
          name: nameSchool.current.value,
          email: email.current.value,
          password: password.current.value,
          type: params.type
        };
      }
      try {
        const res = await axios.post("http://api.local:9900/home/signUp", user);
        if(res.data.success === true) {
          history.push("/login/" + params.type);
        } else {
          setErrorMsg(res.data.message)
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const LearnerInputs = () => {
    return (
      <>
         <input
          placeholder="First Name"
          required
          ref={firstName}
          className="loginInput"
        />
        <input
          placeholder="Last Name"
          required
          ref={lastName}
          className="loginInput"
        />
        <input
          placeholder="Email"
          required
          ref={email}
          className="loginInput"
          type="email"
        />
        <input
          placeholder="Password"
          required
          ref={password}
          className="loginInput"
          type="password"
          minLength="6"
        />
        <input
          placeholder="Password Again"
          required
          ref={passwordAgain}
          className="loginInput"
          type="password"
        />
      </>
    );
  };

  const SchoolInputs = () => {
    return (
      <>
        <input
          placeholder="University or school name"
          required
          ref={nameSchool}
          className="loginInput"
        />
        <input
          placeholder="Email"
          required
          ref={email}
          className="loginInput"
          type="email"
        />
        <input
          placeholder="Password"
          required
          ref={password}
          className="loginInput"
          type="password"
          minLength="6"
        />
        <input
          placeholder="Password Again"
          required
          ref={passwordAgain}
          className="loginInput"
          type="password"
        />
      </>
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
        <h3 className="loginLogo"><img src="/assets/logo.png" alt="logo"/></h3>
        <span className="loginDesc">
          {params.type === 'Learner' ? 
          <span>Register page for <b>learners</b>. Register page for university/school &nbsp;
            <Link to={`${anotherType}`}>
             here
            </Link>.</span> : 
          <span>Register page for <b>university/school</b>. Register page for learners &nbsp;
            <Link to={`${anotherType}`}>
             here
            </Link>.</span>
          }
        </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={submit}>
          <h2 align="center">{params.type}</h2>
            {params.type === 'School' ? <SchoolInputs/> : <LearnerInputs/>}
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link to={`/login/${params.type}`} className="linkButton">
            <button className="loginRegisterButton">Log into Account</button>
            </Link>
            <div className="text-danger">{errorMsg}</div>
          </form>
        </div>
      </div>
    </div>
  );
}