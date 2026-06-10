import { useEffect, useState } from "react";
import { ShieldCheck, Ticket } from "lucide-react";
import api from "../../services/api";

export default function AdminSupportPanel() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/support/admin/tickets");
      setTickets(res.data.tickets || []);
    } catch {
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/support/admin/tickets/${id}/status`, {
        status,
      });

      fetchTickets();
    } catch {
      alert("Failed to update ticket status");
    }
  };

  return (
    <section className="min-h-[calc(100vh-112px)] p-6 text-[#e8f0ec]">
      <div className="rounded-3xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#19b985]">
          <ShieldCheck size={14} />
          Admin Support
        </p>

        <h1 className="mt-5 text-4xl font-black">
          Support Ticket Management
        </h1>

        <div className="mt-8 space-y-5">
          {tickets.length === 0 ? (
            <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-8 text-center">
              <Ticket className="mx-auto text-[#c9933a]" />
              <h3 className="mt-4 text-xl font-black">No Tickets Found</h3>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="rounded-3xl border border-[#27332f] bg-[#111917] p-6"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{ticket.subject}</h3>

                    <p className="mt-1 text-sm text-[#7f8b85]">
                      {ticket.name} · {ticket.email}
                    </p>

                    <p className="mt-1 text-xs text-[#7f8b85]">
                      {new Date(ticket.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      updateStatus(ticket._id, e.target.value)
                    }
                    className="h-11 cursor-pointer rounded-xl border border-[#27332f] bg-[#0b1110] px-4 text-sm font-bold"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#b8c2bc]">
                  {ticket.message}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#c9933a22] px-3 py-1 text-xs font-black text-[#c9933a]">
                    {ticket.category}
                  </span>

                  <span className="rounded-full bg-[#19b98518] px-3 py-1 text-xs font-black text-[#19b985]">
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}