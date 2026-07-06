import { useMemo, useState, useRef, useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
function Navbar({ dark, setDark }) {
  const navigate = useNavigate();
  const settingsRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user")
    )
  );
  const initials = useMemo(() => {
    if (!user?.username) return "?";
    const username = user.username.trim();
    const words = username.split(" ");
    if (words.length > 1) {
      return (
        words[0][0] +
        words[1][0]
      ).toUpperCase();
    }
    const firstLetter = username.charAt(0).toUpperCase();
    const numbers = username.slice(1).match(/\d+/);
    if (numbers) {
      return firstLetter + numbers[0];
    }
    return firstLetter;
  }, [user]);
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
  useEffect(() => {
    function syncUser() {
      setUser(
        JSON.parse(
          localStorage.getItem("user")
        )
      );
    }
    window.addEventListener(
      "storage",
      syncUser
    );
    window.addEventListener(
      "userUpdated",
      syncUser
    );
    return () => {
      window.removeEventListener(
        "storage",
        syncUser
      );
      window.removeEventListener(
        "userUpdated",
        syncUser
      );
    };
  }, []);
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
  return (
    <nav>
      <div className="brand">
        <span className="brand-icon">
          ◎
        </span>
        <h1>
          Focus Board
        </h1>
      </div>
      <div
        className="nav-right"
        ref={settingsRef}
      >
        <div className="profile-avatar">
          {initials}
          <span className="profile-tooltip">
            {user?.username}
          </span>
        </div>
        <button
          className="settings-btn"
          onClick={() =>
            setShowMenu(!showMenu)
          }
        >
          <FiSettings size={20} />
        </button>
        {
          showMenu && (
            <div className="settings-menu">
              <h3>
                Settings
              </h3>
              <hr />
              <Link
                to="/profile"
                className="settings-item"
                onClick={() =>
                  setShowMenu(false)
                }
              >
                Profile
              </Link>
              <div className="settings-group">
                <span>
                  Dark Mode
                </span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={dark}
                    onChange={() =>
                      setDark(!dark)
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <Link
                to="/reminder"
                className="settings-item"
                onClick={() =>
                  setShowMenu(false)
                }
              >
                Due Date Reminder
              </Link>
              <hr />
              <div
                className="settings-item logout-item"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )
        }
      </div>
    </nav>
  );
}
export default Navbar;