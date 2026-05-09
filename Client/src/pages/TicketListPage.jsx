import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import TicketTable from "../components/TicketTable";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import SkeletonTable from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";

export default function TicketListPage({
  endpoint = "/tickets",
  title = "Tickets",
  allowFilters = false,
  searchTerm = ""
}) {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Technical Issue"
  });
  const { push } = useToast();

  async function loadTickets() {
    setLoading(true);
    setError("");

    await api
      .get(endpoint)
      .then((response) => setTickets(response.data))
      .catch((err) => {
        if (!err.response) {
          setError("Cannot connect to API. Make sure backend is running on http://localhost:5000");
          return;
        }
        if (err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setError("Session expired. Please login again.");
          return;
        }
        setError(err.response?.data?.message || "Failed to load tickets");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTickets();
  }, [endpoint]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const byStatus = statusFilter === "All" ? true : ticket.status === statusFilter;
      const byPriority = priorityFilter === "All" ? true : ticket.priority === priorityFilter;
      const query = searchTerm.trim().toLowerCase();
      const bySearch = !query
        ? true
        : ticket.title.toLowerCase().includes(query) || ticket.description.toLowerCase().includes(query);
      return byStatus && byPriority && bySearch;
    });
  }, [tickets, statusFilter, priorityFilter, searchTerm]);

  async function createTicket(event) {
    event.preventDefault();
    try {
      await api.post("/tickets", newTicket);
      setShowModal(false);
      setNewTicket({ title: "", description: "", priority: "Medium", category: "Technical Issue" });
      push("Ticket created successfully");
      await loadTickets();
    } catch (requestError) {
      push(requestError?.response?.data?.message || "Failed to create ticket", "error");
    }
  }

  if (loading) return <SkeletonTable />;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setShowModal(true)}>+ New Ticket</Button>
        </div>
      </div>

      <div className="app-card p-4">
        <div className="grid gap-2 md:grid-cols-3">
          <Input placeholder="Search from header..." value={searchTerm} readOnly />
          {allowFilters ? (
            <>
              <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option>All</option>
                <option>Open</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Waiting for User</option>
                <option>Resolved</option>
                <option>Closed</option>
              </Select>
              <Select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </Select>
            </>
          ) : null}
        </div>
      </div>

      {error ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {!error && filteredTickets.length === 0 ? (
        <div className="app-card p-8 text-center text-sm text-slate-500">
          No tickets found. Try changing search/filter criteria.
        </div>
      ) : (
        <TicketTable tickets={filteredTickets} />
      )}

      <Modal open={showModal} title="Create New Ticket" onClose={() => setShowModal(false)}>
        <form className="space-y-3" onSubmit={createTicket}>
          <Input
            placeholder="Ticket title"
            value={newTicket.title}
            onChange={(event) => setNewTicket((prev) => ({ ...prev, title: event.target.value }))}
          />
          <textarea
            className="input-base"
            rows={4}
            placeholder="Describe the issue"
            value={newTicket.description}
            onChange={(event) => setNewTicket((prev) => ({ ...prev, description: event.target.value }))}
          />
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={newTicket.priority}
              onChange={(event) => setNewTicket((prev) => ({ ...prev, priority: event.target.value }))}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </Select>
            <Select
              value={newTicket.category}
              onChange={(event) => setNewTicket((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option>Technical Issue</option>
              <option>Billing</option>
              <option>Account Access</option>
              <option>General Inquiry</option>
            </Select>
          </div>
          <Button className="w-full" type="submit">
            Create Ticket
          </Button>
        </form>
      </Modal>
    </section>
  );
}