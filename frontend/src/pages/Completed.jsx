import { useEffect, useState } from "react";
import API from "../api";
import TaskCard from "../components/TaskCard";
function Completed() {
  const [tasks, setTasks] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  useEffect(() => {
    fetchTasks();
  }, []);
  async function fetchTasks() {
    try {
      const res = await API.get("/tasks");
      setTasks(
        res.data.filter(
          item => item.completed
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
  return (
    <div className="page-container">
      <div className="page-stat-card">
        <h1>
          Completed Tasks
        </h1>
        <p>
          {tasks.length}
        </p>
      </div>
      <h2>
        Completed Tasks
      </h2>
      <div className="task-list">
        {
          tasks.length === 0 ?
            <p>
              No completed tasks
            </p>
            :
            tasks.map(item => (
              <TaskCard
                mode="completed"
                key={item._id}
                item={item}
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
export default Completed;