import React, { useEffect, useRef } from "react";
import { ChevronRight, LogOut, Settings, UserCircle, X } from "lucide-react";
import useDraggable from "../hooks/useDraggable";

export default function ProfilePanel({ open, onClose, position, setPosition, user, onViewProfile, onSettings, onLogout }) {
  const panelRef = useRef(null);
  const { startDrag } = useDraggable({ position, setPosition, width: 300, height: 320 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    open && (
      <div className="panel-overlay">
        <article
          ref={panelRef}
          className="draggable-panel profile-panel"
          style={{ left: position.x, top: position.y }}
        >
          <header className="panel-header" onMouseDown={startDrag}>
            <div>
              <p className="panel-title">My profile</p>
              <p className="panel-subtitle">Manage account settings and security</p>
            </div>
            <button className="panel-close-button" onClick={onClose} aria-label="Close profile panel">
              <X size={16} />
            </button>
          </header>

          <div className="panel-content profile-content">
            <div className="profile-summary-card">
              <div className="profile-avatar-placeholder">{(user?.name || "U").charAt(0)}</div>
              <div>
                <p className="profile-name-large">{user?.name || "User"}</p>
                <span className="profile-role-chip">{user?.role || "Member"}</span>
                <p className="profile-email">{user?.email || "no-email@example.com"}</p>
              </div>
            </div>

            <div className="profile-actions-list">
              <button className="profile-action-item" onClick={onViewProfile}>
                <div>
                  <p>View profile</p>
                  <span>Review account details and activity</span>
                </div>
                <ChevronRight size={18} />
              </button>
              <button className="profile-action-item" onClick={onSettings}>
                <div>
                  <p>Settings</p>
                  <span>Update notification and app preferences</span>
                </div>
                <Settings size={18} />
              </button>
              <button className="profile-action-item danger" onClick={onLogout}>
                <div>
                  <p>Logout</p>
                  <span>Sign out of your HelpDesk Lite session</span>
                </div>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </article>
      </div>
    )
  );
}
