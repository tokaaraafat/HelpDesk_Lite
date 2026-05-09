import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  List,
  Plus,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "./ui/Input";
import NotificationPanel from "./NotificationPanel";
import ProfilePanel from "./ProfilePanel";
import "../styles/AppLayout.css";

const MIN_W = 220;
const MAX_W = 360;
const COLLAPSED_W = 80;

export default function AppLayout({ children, onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isSupport = user?.role === "admin" || user?.role === "agent";

  const [sidebarW, setSidebarW] = useState(260);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsPosition, setNotificationsPosition] = useState({ x: 0, y: 96 });
  const [profilePosition, setProfilePosition] = useState({ x: 0, y: 96 });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const resizing = useRef(false);
  const sidebarRef = useRef(null);
  const bellButtonRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Handle click outside to close mobile sidebar
  useEffect(() => {
    function handleClickOutside(event) {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const isMenuButton = event.target.closest("[data-menu-button]");
        if (!isMenuButton) {
          setIsMobileOpen(false);
        }
      }
    }

    if (isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobileOpen]);

  const clampPanel = (x, y, width, height) => {
    if (typeof window === "undefined") return { x, y };
    const maxX = Math.max(16, window.innerWidth - width - 16);
    const maxY = Math.max(16, window.innerHeight - height - 16);
    return {
      x: Math.min(Math.max(16, x), maxX),
      y: Math.min(Math.max(16, y), maxY)
    };
  };

  const updateNotificationPosition = () => {
    const rect = bellButtonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 340;
    const height = 420;
    let x = rect.right - width;
    let y = rect.top + 4;
    if (y + height > window.innerHeight - 16) {
      y = Math.max(16, rect.bottom - height - 4);
    }
    setNotificationsPosition(clampPanel(x, y, width, height));
  };

  const updateProfilePosition = () => {
    const rect = profileButtonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 300;
    const height = 320;
    let x = rect.right - width;
    let y = rect.top + 4;
    if (y + height > window.innerHeight - 16) {
      y = Math.max(16, rect.bottom - height - 4);
    }
    setProfilePosition(clampPanel(x, y, width, height));
  };

  useLayoutEffect(() => {
    if (notificationsOpen) {
      updateNotificationPosition();
    }
  }, [notificationsOpen]);

  useLayoutEffect(() => {
    if (profileOpen) {
      updateProfilePosition();
    }
  }, [profileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (notificationsOpen) updateNotificationPosition();
      if (profileOpen) updateProfilePosition();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [notificationsOpen, profileOpen]);

  useEffect(() => {
    const onMove = (e) => {
      if (!resizing.current) return;
      setSidebarW(Math.max(MIN_W, Math.min(MAX_W, e.clientX)));
    };
    const onUp = () => {
      resizing.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleNotificationsToggle() {
    setNotificationsOpen((prev) => !prev);
    setProfileOpen(false);
  }

  function handleProfileToggle() {
    setProfileOpen((prev) => !prev);
    setNotificationsOpen(false);
  }

  function handleViewProfile() {
    setProfileOpen(false);
    navigate("/settings");
  }

  function handleSettings() {
    setProfileOpen(false);
    navigate("/settings");
  }

  const items = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, supportOnly: false },
    { to: "/tickets/my", label: "My Tickets", icon: Ticket, supportOnly: false },
    { to: "/tickets/all", label: "All Tickets", icon: List, supportOnly: true },
    { to: "/tickets/new", label: "Create Ticket", icon: Plus, supportOnly: false },
    { to: "/tickets/assigned", label: "Assigned", icon: UserCheck, supportOnly: true },
    { to: "/reports", label: "Reports", icon: BarChart3, supportOnly: true },
    { to: "/settings", label: "Settings", icon: Settings, supportOnly: false }
  ];

  const filteredItems = items.filter((i) => (i.supportOnly ? isSupport : true));

  const sidebarWidth = isCollapsed ? COLLAPSED_W : sidebarW;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar-container ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
        style={{
          width: isCollapsed ? COLLAPSED_W : sidebarW,
          transition: "width 0.3s ease"
        }}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-mark">✓</div>
            {!isCollapsed && (
              <div className="brand-text">
                <h1 className="text-sm font-semibold text-white">HelpDesk Lite</h1>
                <p className="text-xs text-slate-400">Support workspace</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sidebar-collapse-btn"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft size={18} style={{ transform: isCollapsed ? "rotate(180deg)" : "" }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.to}
                className="sidebar-nav-wrapper"
                onMouseEnter={() => isCollapsed && setActiveTooltip(item.to)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <NavLink
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
                </NavLink>

                {/* Tooltip */}
                {isCollapsed && activeTooltip === item.to && (
                  <div className="sidebar-tooltip">{item.label}</div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="sidebar-logout"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            onMouseDown={() => {
              resizing.current = true;
            }}
            className="sidebar-resize-handle"
          />
        )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          {/* Mobile Menu Button */}
          <button
            data-menu-button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
            type="button"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Search */}
          <div className="w-full max-w-xl mx-2 lg:mx-0">
            <Input
              placeholder="Search tickets..."
              onChange={(event) => onSearch && onSearch(event.target.value)}
            />
          </div>

          {/* Header Actions */}
          <div className="ml-4 flex items-center gap-3">
            <button
              ref={bellButtonRef}
              type="button"
              className={`header-action-btn ${notificationsOpen ? "active" : ""}`}
              onClick={handleNotificationsToggle}
              aria-label="Open notifications"
            >
              <Bell size={18} />
              <span className="header-badge-dot" />
            </button>
            <button
              ref={profileButtonRef}
              type="button"
              className="profile-trigger"
              onClick={handleProfileToggle}
            >
              <div className="profile-avatar">{(user?.name || "U").slice(0, 1)}</div>
              <div className="profile-trigger-copy">
                <span className="profile-name-text">{user?.name}</span>
                <span className="profile-role-text">{user?.role}</span>
              </div>
            </button>
          </div>
        </header>

        <NotificationPanel
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          position={notificationsPosition}
          setPosition={setNotificationsPosition}
        />
        <ProfilePanel
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          position={profilePosition}
          setPosition={setProfilePosition}
          user={user}
          onViewProfile={handleViewProfile}
          onSettings={handleSettings}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}