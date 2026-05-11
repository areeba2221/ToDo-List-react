// import { useState, useEffect } from "react";

// import Video from './Video';
// import Navbar from './Navbar';
// import Input from './Input';
// // import TaskList from './Tasklist';


// function App() {

//     const [todos, setTodos] = useState([]);

//     const addTask = (task) => {

//     setTodos([
//       {
//         text: task,
//         completed: false,
//       },
//       ...todos,
//     ]);

//   };


//   return (

//     <div>

//         <Video/>
//         <Navbar/>
//         <Input />
//         {/* <div className="relative flex items-center pt-11 mx-auto px-5 max-w-286 w-full">

//           <TaskInput addTask={addTask} />
//         </div> */}

//         {/* <TaskList
//         //   todos={filteredTodos}
//         //   toggleComplete={toggleComplete}
//         //   deleteTask={deleteTask}
//         //   editTask={editTask}
//         /> */}

//     </div>

//   );
//   }
// export default App;


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