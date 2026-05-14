import { useState } from "react";
import Video from './components/Video';
import Navbar from './components/Navbar';
import InputTask from "./components/Input";



function App() {

  return (
    <div>

      <Video />
      <Navbar />
      <InputTask />

    </div>
  );
}

export default App;