import { useState, useEffect } from "react";

const InputTask = () => {

    const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
});
    const [inputValue, setInputValue] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);


    const addTask = () => {
        if (inputValue.trim() === "") {
            alert("Enter task first!");
            return;
        }

        setTasks([
            
            {
                id: Date.now(),
                text: inputValue,
                completed: false
            },
            ...tasks
        ]);

        setInputValue("");
    };

    const handleKeyDown = (e) => {
    if (e.key === "Enter") {
        addTask();
    }
};
    
    const toggleTask = (id) => {
        setTasks(
            tasks.map(task =>
                     task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleEdit = (task) => {
        setEditingId(task.id);
        setEditValue(task.text);
    };

    const saveTask = (id) => {
        setTasks(
            tasks.map(task =>
                task.id === id
                    ? { ...task, text: editValue }
                    : task
            ));

        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const filteredTasks = tasks.filter((task) => {

        if (filter === "completed") {
            return task.completed;
        }

        if (filter === "pending") {
            return !task.completed;
        }

        return true;
    });

    return (
        <>
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

            <ul className="relative flex flex-col items-center pt-4 mt-14  pb-5 h-[calc(100vh-300px)]
    overflow-y-auto overflow-x-hidden">

                {filteredTasks.map((task) => (

                    <li key={task.id}
                        className="max-w-155 rounded-[85px] bg-[#D9D9D980] border border-[#FFFFFFB2] py-2 mb-4 w-full
                        shadow-lg backdrop-blur-md">

                        <div className="flex items-center px-5">

                            {editingId === task.id ? (

                                <input type="text" value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="ml-5 flex-1 bg-transparent outline-none text-white text-[40px] font-[Baloo]"/>

                            ) : (

                                <span
                                    className={`ml-5 flex-1 text-[25px] leading-[100%] font-normal font-[Baloo]
                                    ${task.completed
                                            ? "line-through text-white/40"
                                            : "text-white"
                                        }`}>
                                    {task.text}
                                </span>

                            )}

                            {editingId !== task.id ? (
                                <>
                                    <input type="checkbox" checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                        className="appearance-none h-8 w-8 border-4
                                        border-white rounded-full checked:bg-white cursor-pointer"/>

                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="w-8 h-7 flex items-center justify-center ml-4 cursor-pointer" >
                                        <img
                                            src="/edit (2).png" alt="edit"/>
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="w-8 h-7 flex items-center justify-center ml-4 cursor-pointer">
                                        <img
                                            src="/delete box.png" alt="delete"/>
                                    </button>

                                </>
                            ) : (
                                <>
                                     <button
                                        onClick={() => saveTask(task.id)}
                                        className="text-white text-3xl mr-4 cursor-pointer">
                                        <img src="/circle.png"/>
                                    </button>

                                    <button
                                        onClick={cancelEdit}
                                        className="text-white text-3xl cursor-pointer">
                                        <img src="/delete.png"/>
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