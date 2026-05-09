function getTicketBundle(store, ticketId) {
  const ticket = store.tickets.find((item) => item.id === ticketId);
  if (!ticket) return null;

  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    category: ticket.category,
    status: ticket.status,
    createdBy: ticket.createdBy,
    assignedTo: ticket.assignedTo,
    attachmentName: ticket.attachmentName || "",
    comments: ticket.comments || [],
    internalNotes: ticket.internalNotes || [],
    activity: ticket.activity || [],
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt
  };
}

function listTicketBundles(store, filterFn = () => true) {
  return store.tickets
    .filter(filterFn)
    .map((ticket) => getTicketBundle(store, ticket.id))
    .filter(Boolean);
}

function addActivity(store, ticketId, type, message, actorId) {
  const ticket = store.tickets.find((item) => item.id === ticketId);
  if (!ticket) return null;

  const activity = {
    id: store.getNextLogId(),
    type,
    message,
    actorId,
    createdAt: new Date().toISOString()
  };

  ticket.activity.push(activity);
  return activity;
}

module.exports = { getTicketBundle, listTicketBundles, addActivity };