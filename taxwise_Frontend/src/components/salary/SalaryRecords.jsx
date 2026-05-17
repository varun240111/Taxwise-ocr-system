import { useEffect, useState } from "react";
import api from "../../services/api.js";
import {
  CheckCircle2,
  ReceiptText,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

export default function SalaryRecords({ onActiveChanged }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRecords = async () => {
    try {
      const res = await api.get("/salary/all");
      setRecords(res.data.records || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load salary records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleMarkActive = async (id) => {
    try {
      setUpdatingId(id);
      await api.patch(`/salary/${id}/mark-active`);
      await fetchRecords();
      onActiveChanged?.();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark active");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-112px)] p-6 text-[#e8f0ec]">
        <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-8">
          Loading salary records...
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-112px)] p-6 text-[#e8f0ec]">
      <div className="rounded-3xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#19b985]">
              Salary Records
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.4px]">
              Uploaded Salary Receipts
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f8b85]">
              Select one active receipt. Tax calculation will use only the
              active salary receipt.
            </p>
          </div>

          <div className="rounded-2xl border border-[#27332f] bg-[#111917] px-6 py-4 text-center">
            <p className="text-xs text-[#7f8b85]">Total Records</p>
            <h2 className="mt-1 text-3xl font-black text-[#19b985]">
              {records.length}
            </h2>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {records.length === 0 && (
            <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-8 text-center">
              <p className="text-sm text-[#7f8b85]">
                No salary receipts uploaded yet.
              </p>
            </div>
          )}

          {records.map((record) => (
            <div
              key={record._id}
              className={`rounded-3xl border p-5 transition ${
                record.isActive
                  ? "border-[#19b98555] bg-[#10231c]"
                  : "border-[#27332f] bg-[#111917]"
              }`}
            >
              <div className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr_220px] xl:items-center">
                <div className="flex gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                      record.isActive
                        ? "bg-[#19b985] text-[#07100d]"
                        : "bg-[#19221f] text-[#c9933a]"
                    }`}
                  >
                    <ReceiptText size={24} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-extrabold">
                        Year {record.financialYear}
                      </h3>

                      {record.isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#19b98520] px-3 py-1 text-[11px] font-extrabold text-[#19b985]">
                          <CheckCircle2 size={13} />
                          Active
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#9aa69f]">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#27332f] bg-[#0b1110] px-3 py-1.5">
                        <IndianRupee size={14} />
                        Gross ₹{record.grossSalary || 0}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-[#27332f] bg-[#0b1110] px-3 py-1.5">
                        <CalendarDays size={14} />
                        {new Date(record.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Basic" value={record.basicSalary} />
                  <MiniStat label="HRA" value={record.hra} />
                  <MiniStat label="PF" value={record.employerPF} />
                </div>

                <ActiveToggle
                  isActive={record.isActive}
                  disabled={updatingId === record._id}
                  onClick={() => {
                    if (!record.isActive) {
                      handleMarkActive(record._id);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#27332f] bg-[#0b1110] p-4">
      <p className="text-[11px] font-bold text-[#7f8b85]">{label}</p>

      <h4 className="mt-1 text-base font-extrabold text-[#e8f0ec]">
        ₹{value || 0}
      </h4>
    </div>
  );
}

function ActiveToggle({ isActive, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled || isActive}
      onClick={onClick}
      className={`relative h-12 w-full max-w-[210px] rounded-full border p-1 transition disabled:cursor-not-allowed ${
        isActive
          ? "border-[#19b98555] bg-[#19b985]"
          : "border-[#33403a] bg-[#0b1110]"
      }`}
    >
      <div
        className={`absolute top-1 h-10 w-[96px] rounded-full transition-all duration-300 ${
          isActive ? "left-[106px] bg-[#07100d]" : "left-1 bg-[#e8f0ec]"
        }`}
      />

      <div className="relative z-10 grid h-full grid-cols-2 text-[11px] font-black uppercase tracking-[0.16em]">
        <span className="flex items-center justify-center text-[#07100d]">
          Inactive
        </span>

       <span
        className={`flex items-center justify-center ${
          isActive ? "text-white" : "text-[#7f8b85]"
        }`}
        >
        Active
      </span>
      </div>
    </button>
  );
}