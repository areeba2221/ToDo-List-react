import axios from "axios";
import swal from "sweetalert2";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useRef } from "react";
import { logoutUser, changePassword } from "../api/auth";


const API = `${import.meta.env.VITE_BACKEND_URL}/api/todos`;

const InputTask = ({ setIsAuthenticated, user }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [inputError, setInputError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editError, setEditError] = useState("");
    const [filter, setFilter] = useState("all");

     const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPassModal, setShowPassModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passLoading, setPassLoading] = useState(false);
    const dropdownRef = useRef(null);

    

    //validation of task
    const validateTask = (value) => {
        if (!value.trim()) return "Task cannot be empty";
        if (value.trim().length < 3) return "Task must be at least 3 characters";
        if (value.trim().length > 200) return "Task must be under 200 characters";
        return "";
    };

    //user dropdown handle
   useEffect(() => {
          const handleClickOutside = (e) => {
              if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                  setDropdownOpen(false);
              }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

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

    //toggle task
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

    //change password
    const handleChangePassword = async () => {

        // Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("All fields are required");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.error("Password must be 8+ chars with uppercase, lowercase, number & special character");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            setPassLoading(true);
            await changePassword({ currentPassword, newPassword });
            toast.success("Password changed successfully!");

            // Reset and close modal
            setShowPassModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setPassLoading(false);
        }
    };

    //logout 
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
                        <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
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

<div className="ml-10 relative" ref={dropdownRef}>

    <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-12 h-12 rounded-full bg-[#C4BABA5E] border border-[#FFFFFFB2]
        shadow-lg backdrop-blur-md flex items-center justify-center
        cursor-pointer hover:bg-[#ffffff30] transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"
            viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    </button>

    {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl
        bg-white/10 backdrop-blur-xl border border-white/20 z-50 overflow-hidden">

            <div className="px-5 py-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#C4564D] to-[#864B49]
                    flex items-center justify-center text-white font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <p className="text-white font-[Baloo] font-semibold text-[16px] leading-tight">
                            {user?.name || "User"}
                        </p>
                        <p className="text-white/60 font-[Baloo] text-[13px] leading-tight">
                            {user?.email || ""}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-3 py-2 border-b border-white/20">
                <button
                    onClick={() => {
                        setShowPassModal(true);
                        setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5
                    rounded-xl text-white font-[Baloo] text-[15px]
                    hover:bg-white/10 transition cursor-pointer">
                    {/* Key Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                        viewBox="0 0 24 24" fill="none" stroke="white"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="7.5" cy="15.5" r="5.5" />
                        <path d="m21 2-9.6 9.6" />
                        <path d="m15.5 7.5 3 3L22 7l-3-3" />
                    </svg>
                    Change Password
                </button>
            </div>

            <div className="px-3 py-2">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5
                    rounded-xl text-red-400 font-[Baloo] text-[15px]
                    hover:bg-red-500/20 transition cursor-pointer">
                    {/* Logout Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </div>

        </div>
    )}
</div>

{showPassModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center
    bg-black/50 backdrop-blur-sm">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20
        rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-[Baloo] text-2xl font-bold">
                    Change Password
                </h3>
                <button
                    onClick={() => {
                        setShowPassModal(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmNewPassword("");
                    }}
                    className="text-white/60 hover:text-white transition cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-white/80 font-[Baloo] text-sm mb-1">
                    Current Password
                </label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border
                    border-white/20 text-white font-[Baloo] placeholder-white/40
                    outline-none focus:border-[#d3736a] transition"
                />
            </div>

            <div className="mb-4">
                <label className="block text-white/80 font-[Baloo] text-sm mb-1">
                    New Password
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border
                    border-white/20 text-white font-[Baloo] placeholder-white/40
                    outline-none focus:border-[#d3736a] transition"
                />
            </div>

            <div className="mb-6">
                <label className="block text-white/80 font-[Baloo] text-sm mb-1">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border
                    border-white/20 text-white font-[Baloo] placeholder-white/40
                    outline-none focus:border-[#d3736a] transition"
                />
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => {
                        setShowPassModal(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmNewPassword("");
                    }}
                    className="flex-1 py-3 rounded-xl border border-white/20
                    text-white font-[Baloo] text-[16px]
                    hover:bg-white/10 transition cursor-pointer">
                    Cancel
                </button>
                <button
                    onClick={handleChangePassword}
                    disabled={passLoading}
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-[#C4564D] to-[#864B49]
                    text-white font-[Baloo] text-[16px]
                    hover:bg-[#d3736a] transition cursor-pointer disabled:opacity-60">
                    {passLoading ? "Saving..." : "Save Password"}
                </button>
            </div>

        </div>
    </div>
)}

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