import { useEffect, useState } from "react";
import API from "../api";
import TaskCard from "../components/TaskCard";
function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editRepeat, setEditRepeat] = useState("Daily");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  useEffect(() => {
    fetchTasks();
  }, []);
  async function fetchTasks() {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    }
    catch (err) {
      console.log(err);
    }
  }
  async function completeTasks(id) {
    try {
      const res = await API.patch(`/tasks/${id}`);
      setTasks(prev =>
        prev.map(task =>
          task._id === id ? res.data : task
        )
      );
    }
    catch (err) {
      console.log(err);
    }
  }
  async function deleteTasks(id) {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev =>
        prev.filter(task => task._id !== id)
      );
      setDeleteConfirmId(null);
    }
    catch (err) {
      console.log(err);
    }
  }
  function startEdit(item) {
    setEditId(item._id);
    setEditText(item.text);
    setEditDate(item.dueDate || "");
    setEditCategory(item.category || "");
    setEditRepeat(item.repeat);
  }
  async function saveEdit(id) {
    try {
      const res = await API.put(`/tasks/${id}`, {
        text: editText,
        category: editCategory,
        repeat: editRepeat,
        dueDate:
          editRepeat === "Custom"
            ? editDate
            : ""
      });
      setTasks(prev =>
        prev.map(task =>
          task._id === id ? res.data : task
        )
      );
      setEditId(null);
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="page-container">
      <div className="page-stat-card">
        <h1>
          All Tasks
        </h1>
        <p>
          {tasks.length}
        </p>
      </div>
      <h2>
        Your Tasks
      </h2>
      <div className="task-list">
        {
          tasks.length === 0 ?
            <p>
              No tasks
            </p>
            :
            tasks.map(item => (
              <TaskCard
                mode="all"
                key={item._id}
                item={item}
                editId={editId}
                editText={editText}
                setEditText={setEditText}
                editDate={editDate}
                setEditDate={setEditDate}
                editCategory={editCategory}
                setEditCategory={setEditCategory}
                editRepeat={editRepeat}
                setEditRepeat={setEditRepeat}
                saveEdit={saveEdit}
                startEdit={startEdit}
                completeTasks={completeTasks}
                deleteTasks={deleteTasks}
                deleteConfirmId={deleteConfirmId}
                setDeleteConfirmId={setDeleteConfirmId}
              />
            ))
        }
      </div>
    </div>
  );
}
export default AllTasks;