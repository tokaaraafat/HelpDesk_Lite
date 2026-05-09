import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCircle2, Clock3, X } from "lucide-react";
import useDraggable from "../hooks/useDraggable";

const initialNotifications = [
  {
    id: 1,
    title: "New support ticket created",
    description: "A new ticket has been submitted by a customer.",
    time: "5m ago",
    read: false
  },
  {
    id: 2,
    title: "Ticket #237 updated",
    description: "Agent Maria added a response to the ticket.",
    time: "22m ago",
    read: false
  },
  {
    id: 3,
    title: "Weekly summary ready",
    description: "Your dashboard metrics were refreshed.",
    time: "1h ago",
    read: true
  }
];

export default function NotificationPanel({ open, onClose, position, setPosition }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const panelRef = useRef(null);
  const { startDrag } = useDraggable({ position, setPosition, width: 340, height: 420 });

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

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

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    open && (
      <div className="panel-overlay">
        <article
          ref={panelRef}
          className="draggable-panel"
          style={{ left: position.x, top: position.y }}
        >
          <header className="panel-header" onMouseDown={startDrag}>
            <div className="panel-heading">
              <Bell size={18} />
              <div>
                <p className="panel-title">Notifications</p>
                <p className="panel-subtitle">Recent activity, read and unread updates</p>
              </div>
            </div>
            <button className="panel-close-button" onClick={onClose} aria-label="Close notifications">
              <X size={16} />
            </button>
          </header>

          <div className="panel-content">
            <div className="panel-actions-row">
              <span className="panel-badge">{unreadCount} unread</span>
              <button className="panel-link-button" onClick={handleMarkAllRead}>
                Mark all read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="panel-empty-state">
                <p className="panel-empty-title">No notifications yet</p>
                <p className="panel-empty-text">Check back later for workflow updates and ticket alerts.</p>
              </div>
            ) : (
              <div className="panel-list">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`panel-list-item ${item.read ? "read" : "unread"}`}
                  >
                    <div className="panel-list-item-copy">
                      <div className="panel-list-item-title">{item.title}</div>
                      <div className="panel-list-item-description">{item.description}</div>
                    </div>
                    <div className="panel-list-item-meta">
                      <span>{item.time}</span>
                      {item.read ? (
                        <CheckCircle2 size={16} className="panel-list-icon read-icon" />
                      ) : (
                        <Clock3 size={16} className="panel-list-icon unread-icon" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    )
  );
}
