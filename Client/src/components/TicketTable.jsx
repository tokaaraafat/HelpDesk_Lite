import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./ui/StatusBadge";

export default function TicketTable({ tickets }) {
  return (
    <div className="app-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-slate-100 transition hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link to={`/tickets/${ticket.id}`} className="font-medium text-slate-800 hover:text-indigo-600">
                    {ticket.title}
                  </Link>
                  <p className="line-clamp-1 text-xs text-slate-500">{ticket.description}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">#{ticket.createdBy}</td>
                <td className="px-4 py-3">
                  <StatusBadge text={ticket.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge text={ticket.priority} />
                </td>
                <td className="px-4 py-3 text-slate-500">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}