const statuses = ["Open", "Pending", "In Progress", "Waiting for User", "Resolved", "Closed"];
const priorities = ["Low", "Medium", "High", "Urgent"];
const categories = ["Technical Issue", "Billing", "Account Access", "General Inquiry"];

const users = [
  { id: 1, name: "System Admin", email: "admin@helpdesk.com", password: "password123", role: "admin" },
  { id: 2, name: "Support Agent", email: "agent@helpdesk.com", password: "password123", role: "agent" },
  { id: 3, name: "Product User", email: "user@helpdesk.com", password: "password123", role: "user" }
];

const now = new Date().toISOString();

const tickets = [
  {
    id: 1001,
    title: "Unable to access billing page",
    description: "The billing page shows an authorization error after login.",
    priority: "High",
    category: "Billing",
    status: "In Progress",
    createdBy: 3,
    assignedTo: 2,
    attachmentName: "invoice-screenshot.png",
    comments: [
      { id: 1, authorId: 3, authorRole: "user", message: "Issue started this morning.", createdAt: now }
    ],
    internalNotes: [
      { id: 1, authorId: 2, message: "Reproduced. Investigating token scope.", createdAt: now }
    ],
    activity: [
      { id: 1, type: "created", message: "Ticket created", actorId: 3, createdAt: now },
      { id: 2, type: "assigned", message: "Assigned to Support Agent", actorId: 1, createdAt: now },
      { id: 3, type: "status", message: "Status changed to In Progress", actorId: 2, createdAt: now }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 1002,
    title: "Password reset link expired",
    description: "Reset link expires immediately after opening it.",
    priority: "Medium",
    category: "Account Access",
    status: "Open",
    createdBy: 3,
    assignedTo: null,
    attachmentName: "",
    comments: [],
    internalNotes: [],
    activity: [{ id: 4, type: "created", message: "Ticket created", actorId: 3, createdAt: now }],
    createdAt: now,
    updatedAt: now
  }
];

let nextTicketId = 1003;
let nextLogId = 5;

function getNextTicketId() {
  return nextTicketId++;
}

function getNextLogId() {
  return nextLogId++;
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  users,
  tickets,
  statuses,
  priorities,
  categories,
  getNextTicketId,
  getNextLogId,
  sanitizeUser
};