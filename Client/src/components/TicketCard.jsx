import React from "react";
import { Link } from "react-router-dom";
import Badge from "./Badge";

export default function TicketCard({ ticket }) {
  return (
    <Link to={`/tickets/${ticket.id}`} className="ticket-card">
      <div className="ticket-card-top">
        <h3>{ticket.title}</h3>
        <Badge text={ticket.priority} type="priority" />
      </div>
      <p className="muted">{ticket.category}</p>
      <div className="ticket-card-bottom">
        <Badge text={ticket.status} type="status" />
        <span>#{ticket.id}</span>
      </div>
    </Link>
  );
}