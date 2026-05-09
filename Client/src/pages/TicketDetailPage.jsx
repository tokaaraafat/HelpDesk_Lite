import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/ui/StatusBadge";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import { useToast } from "../hooks/useToast";

export default function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const isSupport = user?.role === "admin" || user?.role === "agent";
  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [meta, setMeta] = useState({ statuses: [] });
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [comment, setComment] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const { push } = useToast();

  useEffect(() => {
    Promise.all([
      api.get(`/tickets/${id}`),
      api.get("/tickets/meta"),
      isSupport ? api.get("/auth/agents") : Promise.resolve({ data: [] })
    ])
      .then(([ticketResponse, metaResponse, agentsResponse]) => {
        setTicket(ticketResponse.data);
        setStatus(ticketResponse.data.status);
        setAssignedTo(ticketResponse.data.assignedTo || "");
        setMeta(metaResponse.data);
        setAgents(agentsResponse.data);
      })
      .catch((requestError) => setError(requestError?.response?.data?.message || "Failed to load ticket."));
  }, [id, isSupport]);

  const timeline = useMemo(() => (ticket?.activity || []).slice().reverse(), [ticket]);

  async function updateTicket() {
    try {
      const response = await api.put(`/tickets/${id}`, {
        status,
        assignedTo: assignedTo ? Number(assignedTo) : null
      });
      setTicket(response.data);
      push("Workflow updated");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Update failed.");
    }
  }

  async function addComment() {
    if (!comment.trim()) return;
    try {
      await api.post(`/tickets/${id}/comments`, { message: comment });
      setComment("");
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
      push("Comment added");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Comment failed.");
    }
  }

  async function addInternalNote() {
    if (!internalNote.trim()) return;
    try {
      await api.post(`/tickets/${id}/internal-notes`, { message: internalNote });
      setInternalNote("");
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
      push("Internal note added");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Note failed.");
    }
  }

  if (error) return <div className="rounded-xl bg-red-50 p-3 text-red-700">{error}</div>;
  if (!ticket) return <p className="text-sm text-slate-500">Loading ticket details...</p>;

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className="app-card space-y-4 p-5 xl:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-800">{ticket.title}</h2>
          <div className="flex gap-2">
            <StatusBadge text={ticket.priority} />
            <StatusBadge text={ticket.status} />
          </div>
        </div>
        <p className="text-sm text-slate-700">{ticket.description}</p>
        <p className="text-xs text-slate-500">
          Ticket #{ticket.id} - Category: {ticket.category} - Created: {new Date(ticket.createdAt).toLocaleString()}
        </p>

        {isSupport ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Workflow Controls</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
                <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {(meta.statuses || []).map((item) => <option key={item}>{item}</option>)}
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Assign Agent</label>
                <Select value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Button className="mt-3" onClick={updateTicket}>Save Workflow</Button>
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-100 p-4">
          <h3 className="mb-2 text-sm font-semibold">Comments</h3>
          {(ticket.comments || []).map((item) => (
            <div key={item.id} className="mb-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <strong className="text-xs uppercase text-slate-500">{item.authorRole}</strong>
              <p className="text-sm text-slate-700">{item.message}</p>
            </div>
          ))}
          <textarea className="input-base mb-2" rows={3} value={comment} onChange={(event) => setComment(event.target.value)} />
          <Button onClick={addComment}>Add Comment</Button>
        </div>

        {isSupport ? (
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-2 text-sm font-semibold">Internal Notes</h3>
            {(ticket.internalNotes || []).map((note) => (
              <div key={note.id} className="mb-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm text-slate-700">{note.message}</p>
              </div>
            ))}
            <textarea className="input-base mb-2" rows={3} value={internalNote} onChange={(event) => setInternalNote(event.target.value)} />
            <Button onClick={addInternalNote}>Add Internal Note</Button>
          </div>
        ) : null}
      </article>

      <aside className="app-card p-5">
        <h3 className="mb-3 text-base font-semibold">Activity Timeline</h3>
        {timeline.length === 0 ? <p className="text-sm text-slate-500">No timeline items yet.</p> : null}
        {timeline.map((event) => (
          <div className="mb-3 rounded-lg border border-slate-100 bg-slate-50 p-3" key={event.id}>
            <strong className="block text-sm text-slate-700">{event.message}</strong>
            <span className="text-xs text-slate-500">{new Date(event.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </aside>
    </section>
  );
}