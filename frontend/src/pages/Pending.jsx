import { useEffect, useState } from "react";
import API from "../api";
import TaskCard from "../components/TaskCard";
function Pending() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks();
  }, []);
  async function fetchTasks() {
    try {
      const res = await API.get("/tasks");
      setTasks(
        res.data.filter(
          item => !item.completed
        )
      );
    }
    catch (err) {
      console.log(err);
    }
  }
  async function completeTasks(id) {
    try {
      const res = await API.patch(`/tasks/${id}`);
      setTasks(prev =>
        prev.filter(task => task._id !== id)
      );
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="page-container">
      <div className="page-stat-card">
        <h1>
          Pending Tasks
        </h1>
        <p>
          {tasks.length}
        </p>
      </div>
      <h2>
        Pending Tasks
      </h2>
      <div className="task-list">
        {
          tasks.length === 0 ?
            <p>
              No pending tasks
            </p>
            :
            tasks.map(item => (
              <TaskCard
                mode="pending"
                key={item._id}
                item={item}
                completeTasks={completeTasks}
              />
            ))
        }
      </div>
    </div>
  );
}
export default Pending;