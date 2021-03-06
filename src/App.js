import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

function App() {

    const { user } = useContext(AuthContext)

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    {user ? <Home /> : <Redirect to="/login/Learner" />}
                </Route>
                <Route path="/login/:type">
                    {user ? <Redirect to="/" /> : <Login />}
                </Route>
                <Route path="/register/:type">
                    {user ? <Redirect to="/" /> : <Register />}
                </Route>
                <Route
                    path="/profile/:type/:userId"
                    render={props => {
                        const {
                            match: {
                                params: { type, userId }
                            }
                        } = props;
                        return (
                            <div>
                                {user ?
                                    <Profile key={`${type}-${userId}`} /> :
                                    <Redirect to="/login/Learner" />
                                }
                            </div>
                        );
                    }}
                />
            </Switch>
        </Router>
    );
}

export default App;