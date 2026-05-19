// import { useState } from "react";
// import Video from './components/Video';
// import Navbar from './components/Navbar';
// import InputTask from "./components/Input";

// // const token = localStorage.getItem("token");

// // if (!token) {
// //     return <h1>Please Login First</h1>;
// // }

// function App() {

//   return (
//     <div>

//       <Video />
//       <Navbar />
//       <InputTask />

//     </div>
//   );
// }

// export default App;



import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import InputTask from "./components/Input";
import Video from './components/Video';

import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {

    const token = localStorage.getItem("token");

    return (

        <>
            
             <Video />
            {token && <Navbar />}

            <Routes>

                <Route path="/" element={ token ? <InputTask /> : <Navigate to="/login" />}/>
                <Route path="/login" element={ !token ? <Login /> : <Navigate to="/" /> }/>
                <Route path="/register" element={ !token ? <Register /> : <Navigate to="/" /> }/>

            </Routes>

        </>
    );
}

export default App;