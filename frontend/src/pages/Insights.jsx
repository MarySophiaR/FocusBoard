import { useEffect, useState } from "react";
import API from "../api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);
function Insights({dark}) {
  const [tasks, setTasks] = useState([]);
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
  // ================= Statistics =================
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    task => task.completed
  ).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );
  // ================= Chart =================
// ================= Chart =================
const chartData = {
  labels: ["Completed", "Pending"],
  datasets: [
    {
      data: [
        completedTasks,
        pendingTasks
      ],
      backgroundColor: dark
        ? [
            "#e5e5e5",   // Completed (light grey/white)
            "#000000"    // Pending (black)
          ]
        : [
            "#111111",   // Completed (black)
            "#d9d9d9"    // Pending (grey)
          ],
      borderWidth: 0
    }
  ]
};
const chartOptions = {
  cutout: "72%",
  plugins: {
    legend: {
      display: false
    }
  },
  maintainAspectRatio: true
};
  // ================= Consistency =================
  let stars = "";
  let rating = "";
  if (completionRate >= 90) {
    stars = "★★★★★";
    rating = "Excellent";
  }
  else if (completionRate >= 70) {
    stars = "★★★★☆";
    rating = "Very Consistent";
  }
  else if (completionRate >= 40) {
    stars = "★★★☆☆";
    rating = "Improving";
  }
  else if (completionRate >= 20) {
    stars = "★★☆☆☆";
    rating = "Needs Improvement";
  }
  else {
    stars = "★☆☆☆☆";
    rating = "Just Getting Started";
  }
  // ================= Motivation =================
  let motivation = "";
  if (completionRate >= 90) {
    motivation =
      "Outstanding consistency. Keep building this habit every day.";
  }
  else if (completionRate >= 70) {
    motivation =
      "You're making strong progress. One more completed task each day will take you even further.";
  }
  else if (completionRate >= 40) {
    motivation =
      "You're building momentum. Focus on completing today's highest priority task.";
  }
  else {
    motivation =
      "Every productive journey begins with a single completed task. Start today.";
  }
  return (
    <main>
      <h1 className="dashboard-title">
        Insights
      </h1>
      <p className="dashboard-subtitle">
        Track your productivity and stay motivated.
      </p>
      {/* Completion Rate */}
<div className="insight-card">
  <h2>
    Completion Rate
  </h2>
  <div className="chart-wrapper">
    <div className="chart-box">
      <Doughnut
        data={chartData}
        options={chartOptions}
      />
    </div>
    <div className="completion-text">
      {completionRate}%
    </div>
  </div>
</div>   
{/* Consistency */}
<div className="insight-card">
  <h2>
    Consistency Rating
  </h2>
  <p className="rating-stars">
    {stars}
  </p>
  <p className="rating-text">
    {rating}
  </p>
</div>
{/* Motivation */}
<div className="insight-card">
  <h2>
    Motivation
  </h2>
  <p className="motivation-text">
    {motivation}
  </p>
</div>
    </main>
  );
}
export default Insights;