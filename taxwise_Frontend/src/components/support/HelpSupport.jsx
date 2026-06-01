import { useEffect, useState } from "react";
import {
  CircleHelp,
  Mail,
  FileQuestion,
  ShieldCheck,
  UploadCloud,
  Calculator,
  FileText,
  MessageCircle,
  ArrowRight,
  Ticket,
} from "lucide-react";
import api from "../../services/api";

export default function HelpSupport({ setActivePage }) {
  const [category, setCategory] = useState("OTHER");
  const [priority, setPriority] = useState("MEDIUM");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/support/my-tickets");
      setTickets(res.data.tickets || []);
    } catch (error) {
      console.log("FETCH TICKETS ERROR:", error);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const submitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please enter subject and message");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/support/ticket", {
        category,
        priority,
        subject,
        message,
      });

      alert("Support ticket created successfully");

      setCategory("OTHER");
      setPriority("MEDIUM");
      setSubject("");
      setMessage("");

      fetchTickets();
    } catch (error) {
      console.log("CREATE TICKET ERROR:", error);
      alert(error.response?.data?.message || "Failed to create support ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-112px)] p-6 text-[#e8f0ec]">
      <div className="rounded-3xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#19b985]">
          <CircleHelp size={14} />
          Help & Support
        </p>

        <h1 className="mt-5 text-4xl font-black">Support Center</h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f8b85]">
          Create a real support ticket, track your submitted issues, and get help
          with TaxWise Vault modules.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <SupportCard
            icon={UploadCloud}
            title="Salary Upload Help"
            text="Issues with salary slip upload, OCR extraction, or salary records."
          />

          <SupportCard
            icon={Calculator}
            title="Tax Calculation Help"
            text="Old vs new regime, deduction gaps, ML suggestions, and tax analytics."
          />

          <SupportCard
            icon={FileText}
            title="HR Report Help"
            text="PDF preview, print, download, and HR declaration report problems."
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19b98518] text-[#19b985]">
              <MessageCircle size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-black">Contact Support</h2>

            <p className="mt-3 text-sm leading-6 text-[#7f8b85]">
              Submit your issue. It will be saved in MongoDB and sent to the
              support/admin email configured in backend.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full cursor-pointer rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm font-bold text-[#e8f0ec] outline-none"
                >
                  <option value="ACCOUNT">Account</option>
                  <option value="SALARY_UPLOAD">Salary Upload</option>
                  <option value="TAX_CALCULATION">Tax Calculation</option>
                  <option value="DOCUMENTS">Documents</option>
                  <option value="HR_REPORT">HR Report</option>
                  <option value="SECURITY">Security</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-2 w-full cursor-pointer rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm font-bold text-[#e8f0ec] outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
                Subject
              </label>

              <input
                type="text"
                placeholder="Example: HR report PDF is not downloading"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm font-bold text-[#e8f0ec] outline-none placeholder:text-[#4a5550]"
              />
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
                Message
              </label>

              <textarea
                rows="6"
                placeholder="Describe your issue clearly..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm font-bold text-[#e8f0ec] outline-none placeholder:text-[#4a5550]"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={submitTicket}
                disabled={submitting}
                className="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-6 py-3 text-sm font-extrabold text-[#07100d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => setActivePage("settings")}
                className="cursor-pointer rounded-xl border border-[#27332f] bg-[#0b1110] px-6 py-3 text-sm font-extrabold text-[#e8f0ec]"
              >
                Back to Settings
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19221f] text-[#c9933a]">
              <Ticket size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-black">My Support Tickets</h2>

            <p className="mt-3 text-sm leading-6 text-[#7f8b85]">
              Track previously submitted issues and their current status.
            </p>

            <div className="mt-6 max-h-[520px] space-y-4 overflow-y-auto pr-2">
              {loadingTickets ? (
                <p className="text-sm text-[#7f8b85]">Loading tickets...</p>
              ) : tickets.length === 0 ? (
                <div className="rounded-2xl border border-[#27332f] bg-[#0b1110] p-5">
                  <p className="text-sm font-bold text-[#7f8b85]">
                    No support tickets yet.
                  </p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <TicketCard key={ticket._id} ticket={ticket} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#27332f] bg-[#111917] p-6">
          <h2 className="text-2xl font-black">Quick FAQs</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <FAQ
              question="Why is my tax plan locked?"
              answer="Tax plan unlocks after salary slip upload and tax calculation."
            />

            <FAQ
              question="Where are my uploaded documents stored?"
              answer="Documents are stored in AWS S3 and references are saved in MongoDB."
            />

            <FAQ
              question="Why are notifications showing?"
              answer="Notifications come from real tax gaps, missing proofs, and HR report readiness."
            />

            <FAQ
              question="Why is profile image not showing?"
              answer="If S3 shows AccessDenied, update the bucket policy for profile-images public read or use signed URLs."
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ContactRow
            icon={Mail}
            label="Support Email"
            value="support@taxwisevault.com"
          />
          <ContactRow
            icon={ShieldCheck}
            label="Security"
            value="Report account/document issue"
          />
          <ContactRow
            icon={FileQuestion}
            label="Help Desk"
            value="Tax planning and report support"
          />
        </div>
      </div>
    </section>
  );
}

function SupportCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-6 transition hover:-translate-y-1 hover:border-[#19b98555]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19221f] text-[#c9933a]">
        <Icon size={22} />
      </div>

      <h3 className="mt-5 text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#7f8b85]">{text}</p>
    </div>
  );
}

function TicketCard({ ticket }) {
  return (
    <div className="rounded-2xl border border-[#27332f] bg-[#0b1110] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black">{ticket.subject}</h3>
          <p className="mt-1 text-xs text-[#7f8b85]">
            {new Date(ticket.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        <span className="rounded-full bg-[#19b98518] px-3 py-1 text-[10px] font-black text-[#19b985]">
          {ticket.status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#7f8b85]">{ticket.message}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-[#27332f] px-3 py-1 text-[10px] font-black text-[#c9933a]">
          {ticket.category}
        </span>

        <span className="rounded-full border border-[#27332f] px-3 py-1 text-[10px] font-black text-[#e8f0ec]">
          {ticket.priority}
        </span>
      </div>
    </div>
  );
}

function FAQ({ question, answer }) {
  return (
    <div className="rounded-2xl border border-[#27332f] bg-[#0b1110] p-5">
      <h3 className="text-base font-black">{question}</h3>
      <p className="mt-2 text-sm leading-6 text-[#7f8b85]">{answer}</p>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#27332f] bg-[#111917] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#19b98518] text-[#19b985]">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
          {label}
        </p>
        <p className="mt-1 text-sm font-extrabold text-[#e8f0ec]">{value}</p>
      </div>
    </div>
  );
}