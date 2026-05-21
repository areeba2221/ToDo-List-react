import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import InputTask from "./components/Input";
import Video from './components/Video';
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getMe } from "./api/auth";  

const App = () => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);

   useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                return;
            }
            try {
                const res = await getMe();
                setUser(res.data.user);  // { name, email, _id }
            } catch (err) {
                console.log(err);
                // token expired or invalid
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            }
        };
        fetchUser();
    }, [token]);

    return (

        <>
            
             <Video />
            {token && <Navbar />}

            <Routes>

                <Route path="/" element={ token ? <InputTask setToken={setToken}  user={user}  /> : <Navigate to="/login" />}/>
                <Route path="/login" element={ !token ? <Login setToken={setToken} /> : <Navigate to="/" /> }/>
                <Route path="/register" element={ !token ? <Register setToken={setToken} /> : <Navigate to="/" /> }/>

            </Routes>

        </>
    );
}

export default App;