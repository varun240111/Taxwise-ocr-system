import { useState } from "react";
import api from "../../services/api";
import {
  Calculator,
  IndianRupee,
  TrendingDown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function TaxCalculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      setLoading(true);

      const res = await api.post("/tax/calculate");

      setResult(res.data.result);
    } catch (error) {
      alert(error.response?.data?.message || "Tax calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-112px)] p-6 text-[#e8f0ec]">
      <div className="rounded-3xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#19b985]">
            <ShieldCheck size={14} />
            Tax Engine Ready
          </p>

          <h1 className="mt-5 text-4xl font-extrabold">
            Calculate Your Tax
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f8b85]">
            TaxWise will use your active salary receipt and latest tax details
            to compare old regime and new regime.
          </p>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={loading}
            className="mt-7 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-6 py-4 text-sm font-extrabold text-[#07100d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Calculator size={18} />
            {loading ? "Calculating..." : "Calculate My Tax"}
          </button>

          {result && (
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <TaxCard
                icon={IndianRupee}
                label="Old Regime Tax"
                value={result.taxOldRegime}
              />

              <TaxCard
                icon={IndianRupee}
                label="New Regime Tax"
                value={result.taxNewRegime}
              />

              <TaxCard
                icon={TrendingDown}
                label="Potential Saving"
                value={result.potentialSaving}
              />
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-3xl border border-[#27332f] bg-[#0b1110] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19b98520] text-[#19b985]">
                  <Sparkles size={22} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#7f8b85]">
                    Recommended Regime
                  </p>

                  <h2 className="text-2xl font-extrabold capitalize text-[#19b985]">
                    {result.betterRegime === "same"
                      ? "Both Same"
                      : `${result.betterRegime} Regime`}
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MiniBox label="Gross Annual Salary" value={result.grossAnnualSalary} />
                <MiniBox label="HRA Exemption" value={result.hraExemption} />
                <MiniBox label="Old Taxable Income" value={result.taxableIncomeOld} />
                <MiniBox label="New Taxable Income" value={result.taxableIncomeNew} />
                <MiniBox label="80C Gap" value={result.gap80C} />
                <MiniBox label="80D Gap" value={result.gap80D} />
                <MiniBox label="NPS Gap" value={result.gapNPS} />
                <MiniBox label="Year" value={result.financialYear} isText />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TaxCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-[#27332f] bg-[#0b1110] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19221f] text-[#c9933a]">
        <Icon size={22} />
      </div>

      <p className="mt-5 text-sm font-bold text-[#7f8b85]">{label}</p>

      <h3 className="mt-2 text-3xl font-black text-[#e8f0ec]">
        ₹{Number(value || 0).toLocaleString("en-IN")}
      </h3>
    </div>
  );
}

function MiniBox({ label, value, isText }) {
  return (
    <div className="rounded-2xl border border-[#27332f] bg-[#111917] p-4">
      <p className="text-xs font-bold text-[#7f8b85]">{label}</p>

      <h4 className="mt-2 text-lg font-extrabold text-[#e8f0ec]">
        {isText ? value : `₹${Number(value || 0).toLocaleString("en-IN")}`}
      </h4>
    </div>
  );
}