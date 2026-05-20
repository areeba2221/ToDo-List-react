import axios from "axios";
import swal from "sweetalert2";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = `${import.meta.env.VITE_BACKEND_URL}/api/todos`;

import { logoutUser } from "../api/auth";

import { useState, useEffect } from "react";

const InputTask = ({ setIsAuthenticated }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [inputError, setInputError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editError, setEditError] = useState("");
    const [filter, setFilter] = useState("all");

    //validation of task
    const validateTask = (value) => {
        if (!value.trim()) return "Task cannot be empty";
        if (value.trim().length < 3) return "Task must be at least 3 characters";
        if (value.trim().length > 200) return "Task must be under 200 characters";
        return "";
    };

    //fetch tasks
    useEffect(() => {

        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(API, { withCredentials: true });
                setTasks(
                    [...(res.data.data)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                );
            } catch (err) {
                console.log(err);
                toast.error("Failed to load tasks!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    //add tasks
    const addTask = async () => {
        const error = validateTask(inputValue);
        if (error) {
            toast.error(error);
            return;
        }
        setInputError("");
        try {
            const res = await axios.post(API,
                { description: inputValue },
                { withCredentials: true }
            );

            setTasks([res.data.data || res.data, ...tasks]);
            setInputValue("");
            toast.success("Task added successfully!");
        } catch (err) {
            console.log(err);
            toast.error("Failed to add task!");
        }
    };

    //add enter key handle
    const handleKeyDown = (e) => {
        if (e.key === "Enter")
            addTask();

    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (inputError) setInputError("");
    };

    //check task
    const toggleTask = async (id) => {
        const currentTask = tasks.find(task => task._id === id);
        if (!currentTask) return;
        const updatedStatus = !currentTask.completed;
        setTasks(tasks.map(task =>
            task._id === id ? { ...task, completed: updatedStatus } : task
        ));
        toast.success("Task updated successfully!");
        try {
            const res = await axios.put(`${API}/${id}`,
                { completed: updatedStatus },
                { withCredentials: true }
            );
            setTasks(tasks.map(task => task._id === id ? res.data.data : task));
        } catch (err) {
            console.log(err);
            setTasks(tasks.map(task =>
                task._id === id ? { ...task, completed: currentTask.completed } : task
            ));
            toast.error("Failed to update task!");
        }
    };

    const logout = async () => {
    try {
        await logoutUser();          
        setIsAuthenticated(false);   
    } catch (err) {
        console.log(err);
        setIsAuthenticated(false); 
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
                await axios.delete(`${API}/${id}`, { withCredentials: true })
                setTasks(tasks.filter(task => task._id !== id));

                toast.success("Task deleted successfully!");

            } catch (err) {
                console.log(err);
                toast.error("Failed to Delete Task!");
            }
        }

    };

    //edit tasks
    const handleEdit = (task) => {
        setEditingId(task._id);
        setEditValue(task.description);
        setEditError("");
    };

    //edit save tasks
    const saveTask = async (id) => {
        const error = validateTask(editValue);
        if (error) {
            toast.error(error);
            return;
        }
        setEditError("");

        try {

            const res = await axios.put(`${API}/${id}`,
                { description: editValue },
                { withCredentials: true }
            );

            setTasks(tasks.map(task => task._id === id ? res.data.data : task));

            setEditingId(null);
            toast.success("Task Edited Successfuly!");

        } catch (err) {
            console.log(err);
            toast.error("Failed to edit task!")
        }

    };

    //cancel edit tasks
    const cancelEdit = () => {
        setEditingId(null);
        setEditError("");
    };

    const filteredTasks = Array.isArray(tasks)
        ? tasks.filter(task => {

            if (filter === "completed") return task.completed;

            if (filter === "pending") return !task.completed;

            return true;

        })
        : [];

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

                <input type="text"
                    id="text"
                    className="w-140 h-16 rounded-[7px] text-white text-2xl
                    font-[Baloo] outline-none border bg-[#C4BABA5E] border-[#FFFFFFB2] ml-40 pl-4 shadow-lg backdrop-blur-md"
                    placeholder="Add a new task..." value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown} />

                <button onClick={addTask}
                    className=" rounded-full border bg-[#C4BABA5E] border-[#FFFFFFB2] ml-5 flex items-center justify-center" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" 
                    fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" 
                    strokeLinejoin="round" className="lucide lucideCirclePlusIcon lucideCirclePlus">
                        <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
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

                <div className="ml-10">
                    <button
                        onClick={logout}
                        className="bg-[#C4BABA5E] border border-[#FFFFFFB2] shadow-lg backdrop-blur-md text-white px-4 py-2
                        rounded-xl text-[24px] font-[Baloo] cursor-pointer hover:bg-[#C4564D] transition">
                        Logout
                    </button>
                </div>

            </div>

            <ul className="relative wrap-anywhere flex flex-col items-center pt-4 mt-14  pb-5 h-[calc(100vh-300px)]
    overflow-y-auto overflow-x-hidden">

                {filteredTasks.length === 0 && (
                    <p className="text-white text-2xl font-[Baloo] opacity-60 mt-10">
                        No tasks found.
                    </p>
                )}

                {filteredTasks.map((task) => (

                    <li key={task._id}
                        className="max-w-155 rounded-[85px] py-2 bg-[#D9D9D980] border border-[#FFFFFFB2] mb-4 w-full
                        shadow-lg backdrop-blur-md">

                        <div className="flex items-center px-5">

                            {editingId === task._id ? (

                                <input type="text" value={editValue}
                                    onChange={(e) => {
                                        setEditValue(e.target.value);
                                        if (editError) setEditError("");
                                    }}

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
                                    {/* <input type="checkbox" checked={task.completed}
                                        onChange={() => toggleTask(task._id)}
                                        className="appearance-none h-7 w-8 border-4
                                        border-white rounded-full checked:bg-white cursor-pointer"/> */}
                                    <div
                                        onClick={() => toggleTask(task._id)}
                                        className="cursor-pointer flex items-center justify-center h-7 w-7" >
                                        {task.completed ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="white" stroke="white" 
                                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="white" 
                                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                            </svg>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="w-8 h-7 flex items-center justify-center ml-4 cursor-pointer" >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                        viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" 
                                        strokeLinecap="round" strokeLinejoin="round" 
                                        className="lucide lucideSquarePenIcon lucideSquarePen">
                                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="w-8 h-7 flex items-center justify-center ml-4 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" 
                                         strokeLinecap="round" strokeLinejoin="round" 
                                         className="lucide lucideTrashIcon lucideTrash">
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                            <path d="M3 6h18" />
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                    </button>

                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => saveTask(task._id)}
                                        className="text-white text-3xl mr-4 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                                        className="lucide lucideCheckIcon lucideCheck">
                                            <path d="M20 6 9 17l-5-5" /></svg>
                                    </button>

                                    <button
                                        onClick={cancelEdit}
                                        className="text-white text-3xl cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                                        strokeWidth="2" strokeLinecap="round" 
                                        strokeLinejoin="round" class="lucide lucide-x-icon lucide-x">
                                            <path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
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