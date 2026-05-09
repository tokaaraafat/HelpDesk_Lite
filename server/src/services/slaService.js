/**
 * SLA Escalation Service
 * Handles automatic ticket escalation based on SLA breach
 */

const SLA_THRESHOLD_HOURS = 24;

/**
 * Calculate hours elapsed since ticket creation
 * @param {string} createdAt - ISO timestamp string
 * @returns {number} Hours elapsed
 */
function getElapsedHours(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();
  return (now - created) / (1000 * 60 * 60);
}

/**
 * Check if a ticket qualifies for SLA escalation
 * @param {object} ticket - Ticket object
 * @returns {boolean} True if ticket should be escalated
 */
function shouldEscalate(ticket) {
  // Don't escalate if already Closed or Resolved
  if (ticket.status === "Closed" || ticket.status === "Resolved") {
    return false;
  }

  // Don't escalate if already Escalated
  if (ticket.status === "Escalated") {
    return false;
  }

  // Check if ticket has breached SLA threshold
  const elapsedHours = getElapsedHours(ticket.createdAt);
  return elapsedHours >= SLA_THRESHOLD_HOURS;
}

/**
 * Escalate a single ticket
 * @param {object} ticket - Ticket to escalate
 * @param {number} systemUserId - System user ID for activity log (typically admin)
 * @returns {object} Escalation result
 */
function escalateTicket(ticket, systemUserId = 1) {
  if (!shouldEscalate(ticket)) {
    return { escalated: false, ticket };
  }

  const previousStatus = ticket.status;
  ticket.status = "Escalated";
  ticket.updatedAt = new Date().toISOString();

  // Log the escalation in activity
  if (!ticket.activity) ticket.activity = [];
  ticket.activity.push({
    id: Math.floor(Math.random() * 10000),
    type: "escalation",
    message: `Ticket auto-escalated due to SLA breach (open for ${getElapsedHours(ticket.createdAt).toFixed(1)} hours)`,
    actorId: systemUserId,
    createdAt: ticket.updatedAt
  });

  return {
    escalated: true,
    ticket,
    previousStatus,
    message: `Ticket #${ticket.id} escalated from ${previousStatus} due to SLA breach`
  };
}

/**
 * Process all tickets and escalate those that breach SLA
 * @param {array} tickets - Array of ticket objects
 * @param {number} systemUserId - System user ID for activity log
 * @returns {object} Summary of escalations
 */
function processAllTicketsForEscalation(tickets, systemUserId = 1) {
  const escalations = [];
  const results = tickets.map((ticket) => {
    const result = escalateTicket(ticket, systemUserId);
    if (result.escalated) {
      escalations.push(result.message);
    }
    return result;
  });

  return {
    total: tickets.length,
    escalatedCount: escalations.length,
    escalations,
    results
  };
}

module.exports = {
  getElapsedHours,
  shouldEscalate,
  escalateTicket,
  processAllTicketsForEscalation,
  SLA_THRESHOLD_HOURS
};
