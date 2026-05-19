import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import InputTask from "./components/Input";
import Video from './components/Video';

import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {

   const [token, setToken] = useState(localStorage.getItem("token"));

    return (

        <>
            
             <Video />
            {token && <Navbar />}

            <Routes>

                <Route path="/" element={ token ? <InputTask /> : <Navigate to="/login" />}/>
                <Route path="/login" element={ !token ? <Login setToken={setToken} /> : <Navigate to="/" /> }/>
                <Route path="/register" element={ !token ? <Register /> : <Navigate to="/" /> }/>

            </Routes>

        </>
    );
}

export default App;