const express = require("express");
const { STATUSES, PRIORITIES, CATEGORIES } = require("../constants");
const { authorizeRoles } = require("../middleware/authMiddleware");
const { getTicketBundle, listTicketBundles, addActivity } = require("../services/ticketService");

const router = express.Router();

function canViewTicket(user, ticket) {
  if (user.role === "admin" || user.role === "agent") return true;
  return ticket.createdBy === user.id;
}

router.get("/meta", (req, res) => {
  return res.json({ statuses: STATUSES, priorities: PRIORITIES, categories: CATEGORIES });
});

router.get("/", (req, res) => {
  const store = req.app.locals.store;
  const { role, id } = req.user;
  if (role === "admin" || role === "agent") {
    return res.json(listTicketBundles(store, () => true));
  }
  return res.json(listTicketBundles(store, (ticket) => ticket.createdBy === id));
});

router.get("/assigned/me", authorizeRoles("admin", "agent"), (req, res) => {
  const store = req.app.locals.store;
  return res.json(listTicketBundles(store, (ticket) => ticket.assignedTo === req.user.id));
});

router.get("/analytics/summary", authorizeRoles("admin", "agent"), (req, res) => {
  const store = req.app.locals.store;
  const summary = store.tickets.reduce(
    (acc, ticket) => {
      acc.total += 1;
      if (ticket.status === "Open") acc.open += 1;
      if (["Resolved", "Closed"].includes(ticket.status)) acc.solved += 1;
      if (["Pending", "Waiting for User"].includes(ticket.status)) acc.pending += 1;
      if (ticket.priority === "Urgent") acc.urgent += 1;
      const day = ticket.createdAt.slice(0, 10);
      acc.daily[day] = (acc.daily[day] || 0) + 1;
      return acc;
    },
    { total: 0, open: 0, solved: 0, pending: 0, urgent: 0, daily: {} }
  );

  const createdLast7Days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const key = day.toISOString().slice(0, 10);
    return { day: key, count: summary.daily[key] || 0 };
  });

  return res.json({ ...summary, createdLast7Days });
});

router.get("/:id", (req, res) => {
  const store = req.app.locals.store;
  const ticket = getTicketBundle(store, Number(req.params.id));
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  if (!canViewTicket(req.user, ticket)) return res.status(403).json({ message: "Forbidden" });
  return res.json(ticket);
});

router.post("/", (req, res) => {
  const store = req.app.locals.store;
  const { title, description, priority, category, attachmentName } = req.body || {};
  if (!title || !description || !priority || !category) {
    return res.status(400).json({ message: "Title, description, priority, and category are required" });
  }
  if (!PRIORITIES.includes(priority)) return res.status(400).json({ message: "Invalid priority" });
  if (!CATEGORIES.includes(category)) return res.status(400).json({ message: "Invalid category" });

  const now = new Date().toISOString();
  const ticket = {
    id: req.app.locals.store.getNextTicketId(),
    title: title.trim(),
    description: description.trim(),
    priority,
    category,
    status: "Open",
    createdBy: req.user.id,
    assignedTo: null,
    attachmentName: attachmentName || "",
    comments: [],
    internalNotes: [],
    activity: [],
    createdAt: now,
    updatedAt: now
  };

  store.tickets.unshift(ticket);
  addActivity(store, ticket.id, "created", "Ticket created", req.user.id);
  return res.status(201).json(getTicketBundle(store, ticket.id));
});

router.put("/:id", (req, res) => {
  const store = req.app.locals.store;
  const ticket = store.tickets.find((item) => item.id === Number(req.params.id));
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  const isOwner = ticket.createdBy === req.user.id;
  const canAdminister = req.user.role === "admin" || req.user.role === "agent";
  if (!isOwner && !canAdminister) return res.status(403).json({ message: "Forbidden" });

  const { title, description, status, priority, category, assignedTo } = req.body || {};
  if (title !== undefined) ticket.title = title.trim();
  if (description !== undefined) ticket.description = description.trim();
  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) return res.status(400).json({ message: "Invalid priority" });
    ticket.priority = priority;
  }
  if (category !== undefined) {
    if (!CATEGORIES.includes(category)) return res.status(400).json({ message: "Invalid category" });
    ticket.category = category;
  }
  if (status !== undefined) {
    if (!STATUSES.includes(status)) return res.status(400).json({ message: "Invalid status" });
    ticket.status = status;
    addActivity(store, ticket.id, "status", `Status changed to ${status}`, req.user.id);
  }
  if (assignedTo !== undefined) {
    if (!canAdminister) return res.status(403).json({ message: "Only admin/agent can assign tickets" });
    if (assignedTo === null) {
      ticket.assignedTo = null;
      addActivity(store, ticket.id, "assigned", "Ticket unassigned", req.user.id);
    } else {
      const agent = store.users.find((user) => user.id === Number(assignedTo) && user.role === "agent");
      if (!agent) return res.status(400).json({ message: "Assigned user must be an agent" });
      ticket.assignedTo = agent.id;
      addActivity(store, ticket.id, "assigned", `Assigned to ${agent.name}`, req.user.id);
    }
  }

  ticket.updatedAt = new Date().toISOString();
  return res.json(getTicketBundle(store, ticket.id));
});

router.post("/:id/comments", (req, res) => {
  const store = req.app.locals.store;
  const ticket = getTicketBundle(store, Number(req.params.id));
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  if (!canViewTicket(req.user, ticket)) return res.status(403).json({ message: "Forbidden" });

  const { message } = req.body || {};
  if (!message || !message.trim()) return res.status(400).json({ message: "Comment message is required" });

  const now = new Date().toISOString();
  const comment = {
    id: store.getNextLogId(),
    authorId: req.user.id,
    authorRole: req.user.role,
    message: message.trim(),
    createdAt: now
  };

  const storedTicket = store.tickets.find((item) => item.id === ticket.id);
  storedTicket.comments.push(comment);
  addActivity(store, ticket.id, "comment", "Comment added", req.user.id);
  storedTicket.updatedAt = now;

  return res.status(201).json(comment);
});

router.post("/:id/internal-notes", authorizeRoles("admin", "agent"), (req, res) => {
  const store = req.app.locals.store;
  const ticket = getTicketBundle(store, Number(req.params.id));
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  const { message } = req.body || {};
  if (!message || !message.trim()) return res.status(400).json({ message: "Note message is required" });

  const now = new Date().toISOString();
  const note = {
    id: store.getNextLogId(),
    authorId: req.user.id,
    message: message.trim(),
    createdAt: now
  };

  const storedTicket = store.tickets.find((item) => item.id === ticket.id);
  storedTicket.internalNotes.push(note);
  addActivity(store, ticket.id, "note", "Internal note added", req.user.id);
  storedTicket.updatedAt = now;

  return res.status(201).json(note);
});

module.exports = router;