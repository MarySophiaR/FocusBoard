import { Link } from "react-router-dom";
function Sidebar() {
  return (
    <aside>
      <Link to="/" className="side-link">
        <div className="side-box">
          Dashboard
        </div>
      </Link>
      <Link to="/all" className="side-link">
        <div className="side-box">
          All Tasks
        </div>
      </Link>
      <Link to="/completed" className="side-link">
        <div className="side-box">
          Completed
        </div>
      </Link>
      <Link to="/pending" className="side-link">
        <div className="side-box">
          Pending
        </div>
      </Link>
      {/* FIXED PART */}
      <Link to="/due-reminders" className="side-link">
        <div className="side-box">
          Due Date Reminders
        </div>
      </Link>
      <Link
  to="/insights"
  className="side-link"
>
  <div className="side-box">
    Insights
  </div>
</Link>
    </aside>
  );
}
export default Sidebar;