import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem("user")
  );
  const [username, setUsername] = useState(
    user?.username || ""
  );
  const [editingUsername, setEditingUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function handleSave() {
    try {
      if (
        changePassword &&
        newPassword !== confirmPassword
      ) {
        alert(
          "New password and confirm password do not match."
        );
        return;
      }
      const token = localStorage.getItem("token");
      const res = await API.put(
        "/auth/profile",
        {
          username,
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      window.dispatchEvent(
        new Event("userUpdated")
      );
      setEditingUsername(false);
      setChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/");
    }
    catch (err) {
      alert(
        err.response?.data?.error ||
        "Unable to update profile."
      );
    }
  }
  return (
    <main>
      <div className="profile-container">
        <div className="profile-card">
          <h1>
            Profile
          </h1>
          <p className="profile-subtitle">
            Manage your account settings.
          </p>
          <div className="profile-divider"></div>
          {/* Username */}
          <div className="profile-section">
            <div className="profile-header">
              <h3>
                Username
              </h3>
              <button
                className="profile-action-btn"
                onClick={() =>
                  setEditingUsername(
                    !editingUsername
                  )
                }
              >
                {
                  editingUsername
                    ? "Done"
                    : "Edit"
                }
              </button>
            </div>
            {
              editingUsername ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                />
              ) : (
                <p className="profile-value">
                  {username}
                </p>
              )
            }
          </div>
          <div className="profile-divider"></div>
          {/* Password */}
          <div className="profile-section">
            <div className="profile-header">
              <h3>
                Password
              </h3>
              <button
                className="profile-action-btn"
                onClick={() =>
                  setChangePassword(
                    !changePassword
                  )
                }
              >
                {
                  changePassword
                    ? "Cancel"
                    : "Change"
                }
              </button>
            </div>
            <p className="profile-value">
              ********
            </p>
            {
              changePassword && (
                <div className="password-box">
                  <label>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                  />
                  <label>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                  />
                  <label>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                  />
                </div>
              )
            }
          </div>
          <button
            className="profile-save-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
export default Profile;