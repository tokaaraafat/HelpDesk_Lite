import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import TicketListPage from "./pages/TicketListPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import SettingsPage from "./pages/SettingsPage";
import ReportsPage from "./pages/ReportsPage";
import ToastViewport from "./components/ui/ToastViewport";

function PrivateApp() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <AppLayout onSearch={setSearchTerm}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tickets/my" element={<TicketListPage title="My Tickets" endpoint="/tickets" allowFilters searchTerm={searchTerm} />} />
          <Route path="/tickets/new" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route
            path="/tickets/all"
            element={
              <ProtectedRoute roles={["admin", "agent"]}>
                <TicketListPage title="All Tickets" endpoint="/tickets" allowFilters searchTerm={searchTerm} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/assigned"
            element={
              <ProtectedRoute roles={["admin", "agent"]}>
                <TicketListPage title="Assigned Tickets" endpoint="/tickets/assigned/me" allowFilters searchTerm={searchTerm} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={["admin", "agent"]}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
      <ToastViewport />
    </>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/*" element={<ProtectedRoute><PrivateApp /></ProtectedRoute>} />
    </Routes>
  );
}