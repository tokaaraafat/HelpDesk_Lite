import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import "../styles/SettingsPage.css";

// Demo current user data
const DEFAULT_CURRENT_USER = {
  id: 1,
  name: "System Admin",
  email: "admin@helpdesk.com",
  role: "admin",
  phone: "+1 (555) 123-4567",
  department: "Operations",
  lastLogin: new Date(Date.now() - 3600000).toISOString(),
  profileImage: null
};

// Settings sidebar component
function SettingsSidebar({ activeTab, onTabChange }) {
  const sections = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "account", label: "Account", icon: "🔐" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "security", label: "Security", icon: "🛡️" },
    { id: "system", label: "System", icon: "⚙️" }
  ];

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="settings-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Settings</h3>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`sidebar-nav-item ${activeTab === section.id ? "active" : ""}`}
            onClick={() => onTabChange(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-label">{section.label}</span>
          </button>
        ))}

        {isAdmin && (
          <>
            <div className="sidebar-divider" />
            <div className="sidebar-section-title">Admin</div>
            {[
              { id: "users", label: "User Management", icon: "👥" },
              { id: "workflow", label: "Workflow", icon: "⚡" },
              { id: "categories", label: "Categories", icon: "📂" },
              { id: "analytics", label: "Analytics", icon: "📊" }
            ].map((section) => (
              <button
                key={section.id}
                className={`sidebar-nav-item ${activeTab === section.id ? "active" : ""}`}
                onClick={() => onTabChange(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
              </button>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

// Profile settings section
function ProfileSettings({ currentUser, onSave }) {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(currentUser);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSaving(false);
    localStorage.setItem("profile", JSON.stringify(profile));
    showToast("Profile updated successfully", "success");
    onSave(profile);
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Profile Settings</h2>
        <p>Manage your personal information</p>
      </div>

      <div className="settings-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-placeholder">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-avatar-info">
            <p className="text-sm text-slate-600">Profile Picture</p>
            <div className="button-group-horizontal">
              <Button variant="secondary" size="small">
                Upload
              </Button>
              <Button variant="secondary" size="small">
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <Input
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email"
            disabled
          />
          <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Role</label>
            <Input
              value={profile.role}
              disabled
              className="role-badge"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <Input
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <Input
            value={profile.department}
            onChange={(e) => handleChange("department", e.target.value)}
            placeholder="Enter department"
          />
        </div>

        <div className="form-actions">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

// Account settings section
function AccountSettings() {
  const { showToast } = useToast();
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePasswords = () => {
    const newErrors = {};
    if (!passwords.current) newErrors.current = "Current password is required";
    if (!passwords.new) newErrors.new = "New password is required";
    if (passwords.new.length < 8) newErrors.new = "Password must be at least 8 characters";
    if (passwords.new !== passwords.confirm) newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSaving(false);

    setPasswords({ current: "", new: "", confirm: "" });
    setErrors({});
    showToast("Password changed successfully", "success");
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Account Settings</h2>
        <p>Manage your account security and credentials</p>
      </div>

      <div className="settings-card">
        <h3 className="card-subtitle">Change Password</h3>

        <div className="form-group">
          <label className="form-label">Current Password</label>
          <Input
            type="password"
            value={passwords.current}
            onChange={(e) => {
              setPasswords((prev) => ({ ...prev, current: e.target.value }));
              setErrors((prev) => ({ ...prev, current: "" }));
            }}
            placeholder="Enter current password"
          />
          {errors.current && <p className="form-error">{errors.current}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <Input
            type="password"
            value={passwords.new}
            onChange={(e) => {
              setPasswords((prev) => ({ ...prev, new: e.target.value }));
              setErrors((prev) => ({ ...prev, new: "" }));
            }}
            placeholder="Enter new password"
          />
          {errors.new && <p className="form-error">{errors.new}</p>}
          <p className="text-xs text-slate-500 mt-1">
            At least 8 characters, mix of letters and numbers recommended
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <Input
            type="password"
            value={passwords.confirm}
            onChange={(e) => {
              setPasswords((prev) => ({ ...prev, confirm: e.target.value }));
              setErrors((prev) => ({ ...prev, confirm: "" }));
            }}
            placeholder="Confirm new password"
          />
          {errors.confirm && <p className="form-error">{errors.confirm}</p>}
        </div>

        <div className="form-actions">
          <Button onClick={handleChangePassword} disabled={isSaving}>
            {isSaving ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Notification settings section
function NotificationSettings() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    ticketAssignment: true,
    statusUpdates: true,
    weeklySummary: false
  });

  const handleToggle = (field) => {
    setNotifications((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      localStorage.setItem("notifications", JSON.stringify(updated));
      showToast("Notification preferences updated", "success");
      return updated;
    });
  };

  const notificationOptions = [
    {
      id: "emailNotifications",
      label: "Email Notifications",
      description: "Receive email updates about your tickets"
    },
    {
      id: "ticketAssignment",
      label: "Ticket Assignment",
      description: "Get notified when tickets are assigned to you"
    },
    {
      id: "statusUpdates",
      label: "Ticket Status Updates",
      description: "Receive updates when ticket status changes"
    },
    {
      id: "weeklySummary",
      label: "Weekly Summary",
      description: "Get a weekly summary of your activity"
    }
  ];

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Notification Settings</h2>
        <p>Control how and when you receive notifications</p>
      </div>

      <div className="settings-card">
        {notificationOptions.map((option) => (
          <div key={option.id} className="notification-item">
            <div className="notification-content">
              <p className="notification-label">{option.label}</p>
              <p className="notification-description">{option.description}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications[option.id]}
                onChange={() => handleToggle(option.id)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// Appearance settings section
function AppearanceSettings() {
  const { showToast } = useToast();
  const [appearance, setAppearance] = useState({
    theme: "light",
    compactMode: false,
    colorScheme: "blue"
  });

  const handleChange = (field, value) => {
    setAppearance((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("appearance", JSON.stringify(updated));
      showToast("Appearance settings updated", "success");
      return updated;
    });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Appearance Settings</h2>
        <p>Customize how the application looks</p>
      </div>

      <div className="settings-card">
        <div className="form-group">
          <label className="form-label">Theme</label>
          <Select
            value={appearance.theme}
            onChange={(e) => handleChange("theme", e.target.value)}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "auto", label: "Auto (System)" }
            ]}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Color Scheme</label>
          <div className="color-scheme-selector">
            {["blue", "purple", "emerald", "orange"].map((color) => (
              <button
                key={color}
                className={`color-option ${appearance.colorScheme === color ? "selected" : ""}`}
                style={{
                  backgroundColor: {
                    blue: "#3b82f6",
                    purple: "#a855f7",
                    emerald: "#10b981",
                    orange: "#f97316"
                  }[color]
                }}
                onClick={() => handleChange("colorScheme", color)}
              >
                {appearance.colorScheme === color && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="notification-item">
          <div className="notification-content">
            <p className="notification-label">Compact Mode</p>
            <p className="notification-description">Reduce spacing and padding</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={appearance.compactMode}
              onChange={(e) => handleChange("compactMode", e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
    </div>
  );
}

// Security settings section
function SecuritySettings({ currentUser }) {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogoutAll = () => {
    showToast("Logged out from all devices", "success");
    setTimeout(() => logout(), 1000);
  };

  const lastLoginDate = new Date(currentUser.lastLogin);
  const formattedLastLogin = lastLoginDate.toLocaleString();

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Security Settings</h2>
        <p>Manage your account security and sessions</p>
      </div>

      <div className="settings-card">
        <div className="security-info">
          <div className="info-item">
            <p className="info-label">Last Login</p>
            <p className="info-value">{formattedLastLogin}</p>
          </div>
          <div className="info-item">
            <p className="info-label">Active Sessions</p>
            <p className="info-value">1 session</p>
          </div>
        </div>

        <div className="alert alert-warning">
          <p className="alert-title">⚠️ Logout All Devices</p>
          <p className="alert-message">
            This will log you out from all devices and you'll need to log in again.
          </p>
        </div>

        <div className="form-actions">
          <Button variant="danger" onClick={handleLogoutAll}>
            Logout from All Devices
          </Button>
        </div>
      </div>
    </div>
  );
}

// System preferences section
function SystemPreferences() {
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState({
    dashboardView: "grid",
    language: "en",
    timezone: "UTC"
  });

  const handleChange = (field, value) => {
    setPreferences((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("preferences", JSON.stringify(updated));
      showToast("System preferences updated", "success");
      return updated;
    });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>System Preferences</h2>
        <p>Configure system-wide settings</p>
      </div>

      <div className="settings-card">
        <div className="form-group">
          <label className="form-label">Default Dashboard View</label>
          <Select
            value={preferences.dashboardView}
            onChange={(e) => handleChange("dashboardView", e.target.value)}
            options={[
              { value: "grid", label: "Grid View" },
              { value: "list", label: "List View" },
              { value: "compact", label: "Compact View" }
            ]}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Language</label>
          <Select
            value={preferences.language}
            onChange={(e) => handleChange("language", e.target.value)}
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
              { value: "fr", label: "Français" },
              { value: "de", label: "Deutsch" }
            ]}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Timezone</label>
          <Select
            value={preferences.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}
            options={[
              { value: "UTC", label: "UTC" },
              { value: "EST", label: "Eastern Standard Time" },
              { value: "CST", label: "Central Standard Time" },
              { value: "MST", label: "Mountain Standard Time" },
              { value: "PST", label: "Pacific Standard Time" }
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// Admin-only sections
function UserManagementSection() {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>User Management</h2>
        <p>Manage system users and permissions</p>
      </div>
      <div className="settings-card">
        <Button>Manage Users</Button>
      </div>
    </div>
  );
}

function WorkflowSettingsSection() {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Workflow Settings</h2>
        <p>Configure ticket workflows and automation</p>
      </div>
      <div className="settings-card">
        <Button>Configure Workflows</Button>
      </div>
    </div>
  );
}

function CategoryManagementSection() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([
    "Technical Issue",
    "Billing",
    "Account Access",
    "General Inquiry"
  ]);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      showToast("Category added successfully", "success");
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Ticket Categories</h2>
        <p>Manage ticket categories and types</p>
      </div>
      <div className="settings-card">
        <div className="form-group">
          <label className="form-label">Add New Category</label>
          <div className="input-with-button">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
            />
            <Button onClick={handleAddCategory} size="small">
              Add
            </Button>
          </div>
        </div>

        <div className="categories-list">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-item">
              <span>{cat}</span>
              <button className="category-remove">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsSettingsSection() {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>System Analytics</h2>
        <p>View and export system analytics</p>
      </div>
      <div className="settings-card">
        <Button>View Analytics Dashboard</Button>
      </div>
    </div>
  );
}

// Main Settings Page Component
export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentUser, setCurrentUser] = useState(DEFAULT_CURRENT_USER);

  useEffect(() => {
    const stored = localStorage.getItem("profile");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings currentUser={currentUser} onSave={setCurrentUser} />;
      case "account":
        return <AccountSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "security":
        return <SecuritySettings currentUser={currentUser} />;
      case "system":
        return <SystemPreferences />;
      case "users":
        return <UserManagementSection />;
      case "workflow":
        return <WorkflowSettingsSection />;
      case "categories":
        return <CategoryManagementSection />;
      case "analytics":
        return <AnalyticsSettingsSection />;
      default:
        return <ProfileSettings currentUser={currentUser} onSave={setCurrentUser} />;
    }
  };

  return (
    <div className="settings-page">
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="settings-main">{renderContent()}</main>
    </div>
  );
}