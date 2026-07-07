import { useEffect, useState } from "react";
import API from "../api";
import TaskCard from "../components/TaskCard";

function DueReminders() {

  const [tasks, setTasks] = useState([]);

  const reminder = localStorage.getItem("reminder") || "2";

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

  function getDaysLeft(dueDate) {

    if (!dueDate) return null;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);

    due.setHours(0, 0, 0, 0);

    return Math.ceil(

      (due - today) / (1000 * 60 * 60 * 24)

    );

  }

  const filteredTasks = tasks.filter(task => {

    // Hide completed tasks
    if (task.completed) return false;

    const days = getDaysLeft(task.dueDate);

    if (reminder === "2") return days === 2;
    if (reminder === "1") return days === 1;
    if (reminder === "0") return days === 0;

    return false;

  });

  return (

    <main>

      <div className="stats-card">

        <h2>

          Due Date Reminders

        </h2>

        <span>

          {filteredTasks.length}

        </span>

      </div>

      <h2 className="section-title">

        Upcoming Deadlines

      </h2>

      <div className="task-list">

        {

          filteredTasks.length === 0 ?

          (

            <p>

              No reminder tasks.

            </p>

          )

          :

          (

            filteredTasks.map(item => (

              <TaskCard

                mode="reminder"

                key={item._id}

                item={item}

                editId={null}

                editText=""

                setEditText={() => {}}

                editDate=""

                setEditDate={() => {}}

                editCategory=""

                setEditCategory={() => {}}

                editRepeat=""

                setEditRepeat={() => {}}

                startEdit={() => {}}

                saveEdit={() => {}}

                completeTasks={() => {}}

                deleteTasks={() => {}}

                deleteConfirmId={null}

                setDeleteConfirmId={() => {}}

                newTaskId={null}

                newTaskRef={null}

              />

            ))

          )

        }

      </div>

    </main>

  );

}

export default DueReminders;