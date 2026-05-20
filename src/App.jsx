import { Routes, Route, Navigate } from "react-router-dom";
import { useState , useEffect } from "react";

import Navbar from "./components/Navbar";
import InputTask from "./components/Input";
import Video from './components/Video';
import Login from "./pages/Login";
import Register from "./pages/Register";

import { getMe } from "./api/auth";

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getMe();             
                setIsAuthenticated(true); 
            } catch (err) {
                setIsAuthenticated(false);  
            }
        };
        checkAuth();
    }, []);
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-2xl font-[Baloo]">Loading...</p>
            </div>
        );
    }

    return (

        <>
            
             <Video />
            {isAuthenticated && <Navbar />}

            <Routes>

                <Route path="/" element={ isAuthenticated ? <InputTask setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}/>
                <Route path="/login" element={ !isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" /> }/>
                <Route path="/register" element={ !isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" /> }/>

            </Routes>

        </>
    );
}

export default App;