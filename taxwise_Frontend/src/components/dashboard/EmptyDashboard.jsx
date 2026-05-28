import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  ArrowRight,
  BrainCircuit,
  FileText,
  LockKeyhole,
  UploadCloud,
  UserRoundCheck,
  ShieldCheck,
  Calculator,
  PiggyBank,
  Sparkles,
} from "lucide-react";

export default function EmptyDashboard({ setActivePage }) {
  const [loading, setLoading] = useState(true);
  const [hasSalary, setHasSalary] = useState(false);
  const [taxResult, setTaxResult] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const salaryRes = await api.get("/salary/active");
        setHasSalary(salaryRes.data.hasActiveSalary);

        if (salaryRes.data.hasActiveSalary) {
          try {
            const taxRes = await api.get("/tax/latest");
            if (taxRes.data.hasCalculation) {
              setTaxResult(taxRes.data.result);
            }
          } catch {
            setTaxResult(null);
          }

          try {
            const suggestionRes = await api.get("/suggestions/latest");
            setSuggestion(suggestionRes.data.suggestion);
          } catch {
            setSuggestion(null);
          }
        }
      } catch {
        setHasSalary(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-112px)] text-[#e8f0ec]">
        <div className="rounded-2xl border border-[#27332f] bg-[#111917] p-6">
          Loading dashboard...
        </div>
      </section>
    );
  }

  const dashboardUnlocked = hasSalary;

  return (
    <section className="min-h-[calc(100vh-112px)] text-[#e8f0ec]">
      <div className="relative overflow-hidden rounded-2xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_260px_220px_at_20%_10%,#19b98512_0%,transparent_70%),radial-gradient(ellipse_260px_220px_at_90%_90%,#c9933a10_0%,transparent_70%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-[#27332f] bg-[#111917] p-7">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#19b985]">
              <ShieldCheck size={14} strokeWidth={2.4} />
              {dashboardUnlocked ? "Dashboard unlocked" : "Waiting for salary data"}
            </p>

            <h1 className="max-w-3xl text-[34px] font-extrabold leading-tight tracking-[-0.5px] text-[#e8f0ec] md:text-[46px]">
              {dashboardUnlocked ? (
                <>
                  Your salary-based{" "}
                  <span className="text-[#c9933a]">tax insights are ready.</span>
                </>
              ) : (
                <>
                  Tax insights unlock after{" "}
                  <span className="text-[#c9933a]">salary slip upload.</span>
                </>
              )}
            </h1>

            <p className="mt-4 max-w-2xl text-[13px] font-medium leading-6 text-[#7f8b85]">
              {dashboardUnlocked
                ? "TaxWise has analyzed your active salary receipt. You can now view tax, savings, regime, and investment plan insights."
                : "We do not show fake tax, investment, profit or saving numbers before analyzing your salary. Upload salary slip first, then TaxWise will calculate tax, detect gaps, and generate your tax plan."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setActivePage(dashboardUnlocked ? "calculator" : "upload")
                }
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-5 py-3 text-[13px] font-extrabold text-[#07100d] transition hover:scale-[1.02]"
              >
                {dashboardUnlocked ? "View tax calculator" : "Upload salary slip"}
                <ArrowRight size={16} strokeWidth={2.4} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActivePage(dashboardUnlocked ? "plan" : "profile")
                }
                className="cursor-pointer rounded-xl border border-[#27332f] bg-[#0b1110] px-5 py-3 text-[13px] font-bold text-[#e8f0ec] transition hover:bg-[#141d1a]"
              >
                {dashboardUnlocked ? "View tax plan" : "Setup profile"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#27332f] bg-[#111917] p-6">
            <h3 className="text-[18px] font-extrabold tracking-[-0.3px] text-[#e8f0ec]">
              {dashboardUnlocked ? "Your workflow status" : "Unlock workflow"}
            </h3>

            <p className="mt-1.5 text-[12px] font-medium leading-5 text-[#7f8b85]">
              {dashboardUnlocked
                ? "Your dashboard is now using real salary and tax data."
                : "Dashboard changes based on real salary data only."}
            </p>

            <div className="mt-6 space-y-4">
              <Step
                icon={UserRoundCheck}
                title="Profile check"
                text="Profile and tax inputs are linked to your account."
              />
              <Step
                icon={UploadCloud}
                title="Salary receipt"
                text={dashboardUnlocked ? "Active salary receipt found." : "User uploads salary slip PDF or image."}
              />
              <Step
                icon={BrainCircuit}
                title="Rule engine + suggestions"
                text={taxResult ? "Tax calculation completed." : "Calculate tax to unlock detailed suggestions."}
              />
              <Step
                icon={FileText}
                title="Reports"
                text="HR and document reports can be generated later."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardUnlocked ? (
          <>
            <UnlockedCard
              icon={Calculator}
              title="Current Tax"
              value={
                taxResult
                  ? `₹${Number(
                      Math.min(taxResult.taxOldRegime, taxResult.taxNewRegime)
                    ).toLocaleString("en-IN")}`
                  : "Calculate"
              }
              text={
                taxResult
                  ? "Lowest tax based on your active salary."
                  : "Run tax calculation to unlock this card."
              }
              onClick={() => setActivePage("calculator")}
            />

            <UnlockedCard
              icon={PiggyBank}
              title="Possible Saving"
              value={
                taxResult
                  ? `₹${Number(taxResult.potentialSaving || 0).toLocaleString(
                      "en-IN"
                    )}`
                  : "Pending"
              }
              text="Based on unused deduction gaps."
              onClick={() => setActivePage("calculator")}
            />

            <UnlockedCard
              icon={BrainCircuit}
              title="Recommended Regime"
              value={
                taxResult
                  ? taxResult.betterRegime === "old"
                    ? "Old"
                    : taxResult.betterRegime === "new"
                    ? "New"
                    : "Same"
                  : "Pending"
              }
              text="Old vs New regime comparison."
              onClick={() => setActivePage("calculator")}
            />

            <UnlockedCard
              icon={Sparkles}
              title="Investment Plan"
              value={
                suggestion
                  ? suggestion.best80CInstrument || "Ready"
                  : "Pending"
              }
              text={
                suggestion
                  ? "Personalized suggestion is ready."
                  : "Calculate tax to generate your plan."
              }
              onClick={() => setActivePage("plan")}
            />
          </>
        ) : (
          <>
            <LockedCard title="Current Tax" />
            <LockedCard title="Possible Saving" />
            <LockedCard title="Investment Plan" />
            <LockedCard title="HR Report" />
          </>
        )}
      </div>
    </section>
  );
}

function Step({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#19221f] text-[#c9933a]">
        <Icon size={17} strokeWidth={2.2} />
      </div>

      <div>
        <h4 className="text-[13px] font-bold text-[#e8f0ec]">{title}</h4>
        <p className="mt-0.5 text-[11.5px] font-medium leading-5 text-[#7f8b85]">
          {text}
        </p>
      </div>
    </div>
  );
}

function LockedCard({ title }) {
  return (
    <div className="rounded-2xl border border-[#27332f] bg-[#111917] p-5 transition hover:bg-[#141d1a]">
      <div className="mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#19221f] text-[#c9933a]">
        <LockKeyhole size={18} strokeWidth={2.2} />
      </div>

      <p className="text-[12px] font-bold text-[#7f8b85]">{title}</p>

      <h3 className="mt-2 text-[24px] font-extrabold tracking-[-0.4px] text-[#e8f0ec]">
        Locked
      </h3>

      <p className="mt-2 text-[11.5px] font-medium leading-5 text-[#66736d]">
        Upload salary slip to unlock this section.
      </p>
    </div>
  );
}

function UnlockedCard({ icon: Icon, title, value, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-[#27332f] bg-[#111917] p-5 text-left transition hover:border-[#19b98555] hover:bg-[#141d1a]"
    >
      <div className="mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#19b98518] text-[#19b985]">
        <Icon size={18} strokeWidth={2.2} />
      </div>

      <p className="text-[12px] font-bold text-[#7f8b85]">{title}</p>

      <h3 className="mt-2 text-[24px] font-extrabold tracking-[-0.4px] text-[#e8f0ec]">
        {value}
      </h3>

      <p className="mt-2 text-[11.5px] font-medium leading-5 text-[#66736d]">
        {text}
      </p>
    </button>
  );
}