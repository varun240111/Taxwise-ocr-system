import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
  Sparkles,
  ShieldCheck,
  PiggyBank,
  HeartPulse,
  Trophy,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

export default function MyTaxPlan() {
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await api.get("/suggestions/latest");
        setSuggestion(res.data.suggestion);
      } catch {
        setSuggestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, []);

  const priorityCards = useMemo(() => {
    if (!suggestion) return [];

    const cards = [];

    if (suggestion.suggest80C) {
      cards.push({
        key: "80C",
        icon: PiggyBank,
        saving: Number(suggestion.saving80C || 0),
        title: "Complete 80C Investment",
        tag: "High Priority",
        text: `Recommended option: ${
          suggestion.best80CInstrument === "SSY"
            ? "Sukanya Samriddhi Yojana"
            : suggestion.best80CInstrument || "ELSS / PPF"
        }. Use remaining 80C limit to reduce taxable income.`,
      });
    }

    if (suggestion.suggest80D) {
      cards.push({
        key: "80D",
        icon: HeartPulse,
        saving: Number(suggestion.saving80D || 0),
        title: "Add Health Insurance",
        tag: "Smart Saving",
        text: "Use Section 80D by adding health insurance premium for yourself or family.",
      });
    }

    if (suggestion.suggestNPS) {
      cards.push({
        key: "NPS",
        icon: ShieldCheck,
        saving: Number(suggestion.savingNPS || 0),
        title: "Invest in NPS",
        tag: "Extra Deduction",
        text: "NPS gives extra deduction under 80CCD(1B), outside the 80C limit.",
      });
    }

    cards.sort((a, b) => b.saving - a.saving);

    if (cards.length === 0) {
      return [
        {
          key: "balanced",
          rank: 1,
          icon: BadgeCheck,
          saving: 0,
          title: "No Major Gap Found",
          tag: "Balanced",
          text: "Your current tax-saving inputs look balanced. Keep monitoring during the year.",
        },
      ];
    }

    return cards.map((card, index) => ({
      ...card,
      rank: index + 1,
    }));
  }, [suggestion]);

  if (loading) {
    return (
      <section className="p-6 text-[#e8f0ec]">
        Loading tax plan...
      </section>
    );
  }

  if (!suggestion) {
    return (
      <section className="p-6 text-[#e8f0ec]">
        <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-10 text-center">
          <h1 className="text-3xl font-extrabold">No Tax Plan Yet</h1>
          <p className="mt-3 text-sm text-[#7f8b85]">
            Go to Tax Calculator and click Calculate My Tax.
          </p>
        </div>
      </section>
    );
  }

  const totalSaving =
    Number(suggestion.saving80C || 0) +
    Number(suggestion.saving80D || 0) +
    Number(suggestion.savingNPS || 0);

  return (
    <section className="min-h-[calc(100vh-112px)] p-6 text-[#e8f0ec]">
      <div className="rounded-3xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#19b985]">
            <Sparkles size={14} />
            Tax Saving Suggestions
          </p>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.7px]">
                Your Personalized Tax Plan
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f8b85]">
                Suggestions are shown as priority cards. Higher estimated saving
                appears first.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryCard
                title="Recommended Regime"
                value={suggestion.regimeRecommendation}
                text="Based on latest tax calculation."
              />

              <SummaryCard
                title="Total Estimated Saving"
                value={`₹${Number(totalSaving || 0).toLocaleString("en-IN")}`}
                text="From suggested actions."
                highlight
              />
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {priorityCards.map((card) => (
              <PriorityCard key={card.key} {...card} />
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-[#27332f] bg-[#0b1110] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19b98518] text-[#19b985]">
                <Trophy size={22} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#e8f0ec]">
                  Priority Action Cards
                </h3>
                <p className="text-sm text-[#7f8b85]">
                  Follow cards from left to right. Bar length changes based on
                  estimated saving.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {priorityCards.map((card) => (
                <MiniPriorityCard key={card.key} {...card} />
              ))}

              <MiniPriorityCard
                rank={priorityCards.length + 1}
                title="Review Regime"
                saving={0}
                text={`Current recommendation: ${suggestion.regimeRecommendation}`}
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ title, value, text, highlight }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-[#c9933a55] bg-[#c9933a10]"
          : "border-[#19b98533] bg-[#0b1110]"
      }`}
    >
      <p className="text-sm font-bold text-[#7f8b85]">{title}</p>

      <h2
        className={`mt-2 text-2xl font-black ${
          highlight ? "text-[#c9933a]" : "text-[#19b985]"
        }`}
      >
        {value}
      </h2>

      <p className="mt-2 text-xs text-[#7f8b85]">{text}</p>
    </div>
  );
}

function PriorityCard({ icon: Icon, rank, title, tag, text, saving }) {
  const efficiency = Math.min(
    100,
    Math.max(10, Math.round((Number(saving || 0) / 25000) * 100))
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#27332f] bg-[#0b1110] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#19b98566] hover:bg-[#101917] hover:shadow-[0_22px_70px_rgba(25,185,133,0.12)]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,#19b98522,transparent_45%)]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#19b98518] text-[#19b985]">
          <Icon size={24} />
        </div>

        <span className="rounded-full bg-[#c9933a22] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#c9933a]">
          Priority {rank}
        </span>
      </div>

      <span className="relative z-10 mt-6 inline-flex rounded-full bg-[#19b98518] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#19b985]">
        {tag}
      </span>

      <h3 className="relative z-10 mt-4 text-2xl font-black text-[#e8f0ec]">
        {title}
      </h3>

      <div className="relative z-10 mt-4 rounded-2xl border border-[#27332f] bg-[#111917] p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7f8b85]">
          Estimated Tax Saving
        </p>

        <h4 className="mt-2 text-4xl font-black text-[#19b985]">
          ₹{Number(saving || 0).toLocaleString("en-IN")}
        </h4>
      </div>

      <p className="relative z-10 mt-4 text-sm leading-6 text-[#8d9a94]">
        {text}
      </p>

      <div className="relative z-10 mt-5">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#7f8b85]">
          <span>Tax Efficiency</span>
          <span>{efficiency}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#19221f]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#19b985] to-[#4ade80] transition-all duration-700 group-hover:w-full"
            style={{ width: `${efficiency}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function MiniPriorityCard({ rank, title, text, saving, highlight }) {
  const efficiency = highlight
    ? 40
    : Math.min(
        100,
        Math.max(10, Math.round((Number(saving || 0) / 25000) * 100))
      );

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(25,185,133,0.12)] ${
        highlight
          ? "border-[#c9933a55] bg-[#c9933a10]"
          : "border-[#27332f] bg-[#111917]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,#19b98522,transparent_45%)]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${
            highlight
              ? "bg-[#c9933a22] text-[#c9933a]"
              : "bg-[#19b98518] text-[#19b985]"
          }`}
        >
          {rank}
        </div>

        <TrendingUp
          size={18}
          className={highlight ? "text-[#c9933a]" : "text-[#19b985]"}
        />
      </div>

      <div className="relative z-10 mt-6">
        <h4 className="text-lg font-black text-[#e8f0ec]">
          {title}
        </h4>

        <p className="mt-2 text-sm leading-6 text-[#7f8b85]">
          {text ||
            `Estimated saving ₹${Number(saving || 0).toLocaleString("en-IN")}`}
        </p>
      </div>

      <div className="relative z-10 mt-5 h-1.5 overflow-hidden rounded-full bg-[#19221f]">
        <div
          className={`h-full rounded-full transition-all duration-500 group-hover:w-full ${
            highlight ? "bg-[#c9933a]" : "bg-[#19b985]"
          }`}
          style={{ width: `${efficiency}%` }}
        />
      </div>
    </div>
  );
}