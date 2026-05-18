import axios from "axios";
import swal from "sweetalert2";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = `${import.meta.env.VITE_BACKEND_URL}/api/todos`;

import { useState, useEffect } from "react";

const InputTask = () => {

    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [filter, setFilter] = useState("all");

    //fetch tasks
    useEffect(() => {

        const fetchTasks = async () => {
            try {
                const res = await axios.get(API);
                setTasks(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTasks();

    }, []);

    //add tasks
    const addTask = async () => {
        if (inputValue.trim() === "") {
            toast.error("Enter task first!");
            return;
        }
        try {
            const res = await axios.post(API, {
                description: inputValue
            });

            setTasks([res.data, ...tasks]);
            setInputValue("");

            toast.success("Add Tasks Successfully!");

        } catch (err) {
            console.log(err);
            toast.error("Failed to AddTask!");
        }
    };

    //add enter key handle
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    };

    //check task
    const toggleTask = async (id) => {

        const currentTask =
            tasks.find(task => task._id === id);

        if (!currentTask) return;

        try {

            const res = await axios.put(`${API}/${id}`, { completed: !currentTask.completed });

            setTasks(
                tasks.map(task =>
                    task._id === id
                        ? res.data : task
                )
            );

            toast.success("Completed Task Successfuly!");

        } catch (err) {

            console.log(err);
            toast.error("Failed to Comleted!");

        }
    };

    //delete tasks
    const deleteTask = async (id) => {

        const result = await swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        })
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API}/${id}`)
                setTasks(
                    tasks.filter(task => task._id !== id));

                toast.success("Deleted Task Successfuly!");

            } catch (err) {
                console.log(err);
                toast.error("Failed to Deleted!");
            }
        }

    };

    //edit tasks
    const handleEdit = (task) => {
        setEditingId(task._id);
        setEditValue(task.description);
    };

    //edit save tasks
    const saveTask = async (id) => {

        try {

            const res = await axios.put(`${API}/${id}`, { description: editValue });

            setTasks(
                tasks.map(task =>
                    task._id === id ? res.data : task
                ));

            setEditingId(null);
            toast.success("Edited Task Successfuly!");

        } catch (err) {
            console.log(err);
            toast.error("Edited Task Failed!")
        }

    };

    //cancel edit tasks
    const cancelEdit = () => {
        setEditingId(null);
    };

    //filter tasks
    const filteredTasks = tasks.filter(task => {

        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;

        return true;
    });

    return (


        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnHover
                theme="dark"
                />
            <div className="relative flex items-center pt-11 mx-auto px-5 max-w-286 w-full">

                <input type="text" className="w-140 h-16 rounded-[7px] text-white text-2xl
                    font-[Baloo] outline-none border bg-[#C4BABA5E] border-[#FFFFFFB2] ml-40 pl-4 shadow-lg backdrop-blur-md"
                    placeholder="Add a new task..." value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown} />

                <button onClick={addTask}
                    className="w-16 h-16 rounded-full border bg-[#C4BABA5E] border-[#FFFFFFB2] ml-5 flex items-center justify-center" >
                    <img src="/add.png" alt="add" />
                </button>

                <div className="ml-20">

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="focus:outline-none appearance-none font-[Baloo] text-white shadow-lg backdrop-blur-md
        w-62 h-15 font-normal text-[24px] leading-[100%] rounded-xl border bg-[#C4BABA5E] border-[#FFFFFFB2] pl-6.25 cursor-pointer">

                        <option value="all" className="text-black">
                            All
                        </option>

                        <option value="completed" className="text-black">
                            Complete
                        </option>

                        <option value="pending" className="text-black">
                            Pending
                        </option>

                    </select>

                </div>

            </div>

            <ul className="relative wrap-anywhere flex flex-col items-center pt-4 mt-14  pb-5 h-[calc(100vh-300px)]
    overflow-y-auto overflow-x-hidden">

                {filteredTasks.map((task) => (

                    <li key={task._id}
                        className="max-w-155 rounded-[85px] py-2 bg-[#D9D9D980] border border-[#FFFFFFB2] mb-4 w-full
                        shadow-lg backdrop-blur-md">

                        <div className="flex items-center px-5">

                            {editingId === task._id ? (

                                <input type="text" value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="ml-5 flex-1  outline-none text-white text-[25px] font-[Baloo]" />

                            ) : (

                                <span
                                    className={`ml-5 flex w-full text-[30px] leading-[100%] font-normal font-[Baloo]
                                    ${task.completed
                                            ? "line-through text-white/40"
                                            : "text-white"
                                        }`}>
                                    {task.description}
                                </span>

                            )}

                            {editingId !== task._id ? (
                                <>
                                    <input type="checkbox" checked={task.completed}
                                        onChange={() => toggleTask(task._id)}
                                        className="appearance-none h-7 w-8 border-4
                                        border-white rounded-full checked:bg-white cursor-pointer"/>

                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="w-8 h-7 flex items-center justify-center ml-4 cursor-pointer" >
                                        <img
                                            src="/edit (2).png" alt="edit" />
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="w-8 h-7 flex items-center justify-center ml-4 cursor-pointer">
                                        <img
                                            src="/delete box.png" alt="delete" />
                                    </button>

                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => saveTask(task._id)}
                                        className="text-white text-3xl mr-4 cursor-pointer">
                                        <img src="/circle.png" className="h-6" />
                                    </button>

                                    <button
                                        onClick={cancelEdit}
                                        className="text-white text-3xl cursor-pointer">
                                        <img src="/delete.png" className="h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default InputTask;