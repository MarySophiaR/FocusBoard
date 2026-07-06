import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Reminder() {
  const navigate = useNavigate();
  const [reminder, setReminder] = useState("2");
  function handleSave() {
    localStorage.setItem("reminder", reminder);
    navigate(-1); // go back to previous page (Dashboard)
  }
  return (
    <main>
      <div className="reminder-container">
        <div className="reminder-card">
          <h1>
            Due Date Reminder
          </h1>
          <p className="reminder-subtitle">
            Notify me:
          </p>
          <div className="reminder-options">
            <label>
              <input
                type="radio"
                name="reminder"
                value="2"
                checked={reminder === "2"}
                onChange={(e) =>
                  setReminder(e.target.value)
                }
              />
              2 days before
            </label>
            <label>
              <input
                type="radio"
                name="reminder"
                value="1"
                checked={reminder === "1"}
                onChange={(e) =>
                  setReminder(e.target.value)
                }
              />
              1 day before
            </label>
            <label>
              <input
                type="radio"
                name="reminder"
                value="0"
                checked={reminder === "0"}
                onChange={(e) =>
                  setReminder(e.target.value)
                }
              />
              On the due date
            </label>
          </div>
          <button
            className="reminder-save-btn"
            onClick={handleSave}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}
export default Reminder;