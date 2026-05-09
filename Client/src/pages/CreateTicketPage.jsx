import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { useToast } from "../hooks/useToast";

export default function CreateTicketPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Technical Issue");
  const [attachmentName, setAttachmentName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ priorities: [], categories: [] });
  const navigate = useNavigate();
  const { push } = useToast();

  useEffect(() => {
    api.get("/tickets/meta").then((response) => setMeta(response.data));
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/tickets", { title, description, priority, category, attachmentName });
      push("Ticket submitted successfully");
      navigate(`/tickets/${response.data.id}`);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Could not create ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Create Ticket</h2>
        <p className="text-sm text-slate-500">Submit a new support request with complete context.</p>
      </div>
      <form className="app-card space-y-3 p-5" onSubmit={onSubmit}>
        <label className="text-sm font-medium text-slate-700">Ticket Title</label>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Brief issue summary" />
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea className="input-base" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} />
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Priority</label>
            <Select value={priority} onChange={(event) => setPriority(event.target.value)}>
              {(meta.priorities.length ? meta.priorities : ["Low", "Medium", "High", "Urgent"]).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Category</label>
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              {(meta.categories.length
                ? meta.categories
                : ["Technical Issue", "Billing", "Account Access", "General Inquiry"]).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Select>
          </div>
        </div>
        <label className="text-sm font-medium text-slate-700">Attachment Placeholder</label>
        <Input
          value={attachmentName}
          onChange={(event) => setAttachmentName(event.target.value)}
          placeholder="e.g. error-screenshot.png"
        />
        {error ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
        <Button className="w-full md:w-auto" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </Button>
      </form>
    </section>
  );
}