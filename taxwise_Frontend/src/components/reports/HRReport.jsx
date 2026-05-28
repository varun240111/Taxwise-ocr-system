import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Sparkles,
  User,
  TrendingDown,
  Shield,
  PiggyBank,
  HeartPulse,
  Award,
  Building2,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react";

// ── colour tokens (consistent with your dark theme) ─────────────────────
const T = {
  bg:      "#05080a",
  s1:      "#090e12",
  s2:      "#0d1318",
  s3:      "#111820",
  b1:      "#172030",
  b2:      "#1e2d3d",
  b3:      "#253545",
  text:    "#dde8f0",
  text2:   "#7a9ab0",
  text3:   "#3d5468",
  cyan:    "#1de8c8",
  cyanD:   "#1de8c818",
  cyanS:   "#1de8c840",
  amber:   "#f5a623",
  amberD:  "#f5a62318",
  amberS:  "#f5a62340",
  violet:  "#a78bfa",
  violetD: "#a78bfa18",
  rose:    "#f54f6d",
  blue:    "#3d9cf5",
  blueD:   "#3d9cf520",
  green:   "#22c55e",
  greenD:  "#22c55e18",
  white:   "#ffffff",
};

// ── tiny helpers ─────────────────────────────────────────────────────────
const fmt = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

// ── sub-components ────────────────────────────────────────────────────────

function SectionHeader({ number, title, icon: Icon, color = T.cyan }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 13,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 600, color: T.text3, letterSpacing: ".1em",
        }}>
          {number}
        </span>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.35rem", fontWeight: 700, color: T.text, letterSpacing: "-.01em",
        }}>
          {title}
        </h2>
      </div>
    </div>
  );
}

function Section({ children, style = {} }) {
  return (
    <div style={{
      background: T.s1,
      border: `1px solid ${T.b1}`,
      borderRadius: 20,
      padding: "28px 26px",
      marginBottom: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}

function MetricCard({ label, value, color = T.text, sub }) {
  return (
    <div style={{
      background: T.s2,
      border: `1px solid ${T.b1}`,
      borderRadius: 16,
      padding: "18px 20px",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: T.text3, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "1.45rem", fontWeight: 600, color, lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: T.text3, marginTop: 6 }}>{sub}</div>
      )}
    </div>
  );
}

function DataRow({ label, value, tag, tagColor = T.text3, last = false }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2fr 1.5fr 1fr",
      gap: 12,
      padding: "13px 16px",
      borderBottom: last ? "none" : `1px solid ${T.b1}`,
      alignItems: "center",
    }}>
      <span style={{ fontSize: 13, color: T.text2 }}>{label}</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13, fontWeight: 600, color: T.text,
      }}>
        {value}
      </span>
      {tag && (
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
          textTransform: "uppercase", color: tagColor,
          padding: "2px 9px", borderRadius: 100,
          background: `${tagColor}18`, border: `1px solid ${tagColor}22`,
          display: "inline-block", whiteSpace: "nowrap",
        }}>
          {tag}
        </span>
      )}
    </div>
  );
}

function RegimeCard({ title, tax, income, recommended }) {
  const color = recommended ? T.cyan : T.text3;
  return (
    <div style={{
      background: recommended ? `${T.cyan}08` : T.s2,
      border: `1.5px solid ${recommended ? T.cyanS : T.b1}`,
      borderRadius: 18,
      padding: "24px 22px",
      position: "relative",
      transition: "border-color .25s",
    }}>
      {recommended && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${T.cyan}, transparent)`,
          borderRadius: "18px 18px 0 0",
        }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3 }}>
          {title}
        </div>
        {recommended && (
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase",
            color: T.cyan, background: T.cyanD, border: `1px solid ${T.cyanS}`,
            padding: "3px 10px", borderRadius: 100,
          }}>
            Recommended
          </div>
        )}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "2.2rem", fontWeight: 600, color, lineHeight: 1, marginBottom: 10,
      }}>
        {fmt(tax)}
      </div>
      <div style={{ fontSize: 12, color: T.text3 }}>
        Taxable Income: <span style={{ color: T.text2, fontWeight: 600 }}>{fmt(income)}</span>
      </div>
    </div>
  );
}

function GapBar({ label, used, total, color }) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  const gap = total - used;
  return (
    <div style={{
      background: T.s2, border: `1px solid ${T.b1}`,
      borderRadius: 16, padding: "18px 20px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: T.text3 }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color }}>Gap: {fmt(gap)}</span>
      </div>
      <div style={{ height: 5, background: T.b2, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: color,
          borderRadius: 3, transition: "width .6s cubic-bezier(.4,0,.2,1)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: T.text3 }}>Used: <span style={{ color: T.text2 }}>{fmt(used)}</span></span>
        <span style={{ fontSize: 11, color: T.text3 }}>Limit: <span style={{ color: T.text2 }}>{fmt(total)}</span></span>
      </div>
    </div>
  );
}

function SuggestionCard({ icon: Icon, section, title, saving, instrument, color }) {
  return (
    <div style={{
      background: `${color}08`, border: `1px solid ${color}22`,
      borderRadius: 16, padding: "20px 18px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: color, opacity: .6, borderRadius: "3px 0 0 3px",
      }} />
      <div style={{
        width: 38, height: 38, borderRadius: 12, background: `${color}18`,
        border: `1px solid ${color}30`, display: "flex", alignItems: "center",
        justifyContent: "center", marginBottom: 12, color,
      }}>
        <Icon size={17} />
      </div>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color, marginBottom: 6 }}>
        {section}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: T.text, marginBottom: 10 }}>
        {title}
      </div>
      <div style={{
        background: T.s2, border: `1px solid ${T.b1}`, borderRadius: 10,
        padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: T.text3 }}>Tax Saving</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color }}>{fmt(saving)}</span>
      </div>
      {instrument && (
        <div style={{ marginTop: 10, fontSize: 11, color: T.text3 }}>
          Instrument: <span style={{ color: T.text2, fontWeight: 600 }}>{instrument}</span>
        </div>
      )}
    </div>
  );
}

function DocCheckRow({ label, status, last = false }) {
  const colors = {
    complete:  { c: T.cyan,   bg: T.cyanD,   text: "Complete" },
    pending:   { c: T.amber,  bg: T.amberD,  text: "Pending"  },
    missing:   { c: T.rose,   bg: "#f54f6d18", text: "Missing" },
  };
  const s = colors[status] || colors.pending;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px",
      borderBottom: last ? "none" : `1px solid ${T.b1}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <CheckCircle2 size={15} color={status === "complete" ? T.cyan : T.text3} />
        <span style={{ fontSize: 13, color: T.text2 }}>{label}</span>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase",
        color: s.c, background: s.bg, border: `1px solid ${s.c}22`,
        padding: "2px 10px", borderRadius: 100,
      }}>
        {s.text}
      </span>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────
export default function HRReport() {
  const [loading,     setLoading]     = useState(true);
  const [profile,     setProfile]     = useState(null);
  const [salary,      setSalary]      = useState(null);
  const [tax,         setTax]         = useState(null);
  const [suggestion,  setSuggestion]  = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, sRes, tRes] = await Promise.all([
          api.get("/profile"),
          api.get("/salary/active"),
          api.get("/tax/latest"),
        ]);
        setProfile(pRes.data.profile);
        setSalary(sRes.data.record || sRes.data.salaryRecord || null);
        setTax(tRes.data.result || null);
        try {
          const sgRes = await api.get("/suggestions/latest");
          setSuggestion(sgRes.data.suggestion);
        } catch { setSuggestion(null); }
      } catch {
        setProfile(null); setSalary(null); setTax(null);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.post(
        "/reports/tax-report",
        { profile, salary, tax, suggestion },
        { responseType: "blob" }
      );
      const url  = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", "TaxWise-HR-Declaration-Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Report generation failed. Please calculate tax first.");
    } finally {
      setDownloading(false);
    }
  };

  // ── loading state ──
  if (loading) {
    return (
      <section style={{ minHeight: "calc(100vh - 112px)", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: `2px solid ${T.b2}`, borderTopColor: T.cyan,
            margin: "0 auto 16px",
            animation: "spin 0.9s linear infinite",
          }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ fontSize: 13, color: T.text3 }}>Loading report data…</p>
        </div>
      </section>
    );
  }

  // ── not ready state ──
  if (!profile || !salary || !tax) {
    return (
      <section style={{ minHeight: "calc(100vh - 112px)", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{
          background: T.s1, border: `1px solid ${T.b1}`,
          borderRadius: 24, padding: "48px 40px", textAlign: "center", maxWidth: 420,
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: T.amberD, border: `1px solid ${T.amberS}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <FileText size={24} color={T.amber} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: T.text, marginBottom: 10 }}>
            Report Not Ready
          </h1>
          <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.7 }}>
            Complete your profile, upload your salary slip, and run a tax calculation first.
          </p>
        </div>
      </section>
    );
  }

  // ── derived values ──
  const annualBasic    = Number(salary.basicSalary    || 0) * 12;
  const annualHra      = Number(salary.hra            || 0) * 12;
  const annualSpecial  = Number(salary.specialAllowance || 0) * 12;
  const annualBonus    = Number(salary.bonus          || 0) * 12;
  const annualPF       = Number(salary.employerPF     || 0) * 12;

  const totalSuggestionSaving =
    Number(suggestion?.saving80C || 0) +
    Number(suggestion?.saving80D || 0) +
    Number(suggestion?.savingNPS || 0);

  const isOldBetter = (tax.betterRegime || tax.recommendedRegime) === "old";
  const currentYear = new Date().getFullYear();

  const docChecklist = [
    { label: "Salary Slip (OCR Verified)",          status: salary ? "complete" : "missing"   },
    { label: "Profile & Personal Details",           status: profile ? "complete" : "missing"  },
    { label: "Tax Calculation Run",                  status: tax ? "complete" : "missing"      },
    { label: "LIC / ELSS Investment Receipt",        status: (tax.gap80C === 0) ? "complete" : (tax.gap80C < 150000 ? "pending" : "missing") },
    { label: "Health Insurance Premium Receipt",     status: suggestion?.suggest80D ? "missing" : "complete" },
    { label: "NPS Statement",                        status: suggestion?.suggestNPS ? "missing" : "complete" },
    { label: "Rent Receipts (HRA claim)",            status: tax.hraExemption > 0 ? "complete" : "pending"  },
    { label: "ML Suggestion Report",                 status: suggestion ? "complete" : "pending" },
  ];

  // ── render ──
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #172030; border-radius: 3px; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
        }
      `}</style>

      <section style={{
        minHeight: "calc(100vh - 112px)",
        background: T.bg,
        fontFamily: "'Syne', sans-serif",
        color: T.text,
        position: "relative",
      }}>

        {/* ── sticky top bar ──────────────────────────────── */}
        <div className="no-print"
        style={{
          position: "relative",
          background: `${T.s1}ee`,
          borderBottom: `1px solid ${T.b1}`,
          padding: "24px 32px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
        }}>
          {/* left */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13,
              background: T.cyanD, border: `1px solid ${T.cyanS}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FileText size={20} color={T.cyan} />
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: T.text }}>
                HR Tax Declaration Report
              </div>
              <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>
                 {currentYear} &nbsp;·&nbsp; Generated by TaxWise Vault
              </div>
            </div>
          </div>

          {/* status chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, flex: 1, justifyContent: "center" }}>
            {[
              { label: "Analysis Complete",   color: T.cyan  },
              { label: `${isOldBetter ? "Old" : "New"} Regime Advised`, color: T.amber },
              { label: `Save ${fmt(totalSuggestionSaving)}`, color: T.green },
            ].map((chip) => (
              <span key={chip.label} style={{
                fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                textTransform: "uppercase", padding: "4px 12px", borderRadius: 100,
                color: chip.color, background: `${chip.color}14`,
                border: `1px solid ${chip.color}22`,
              }}>
                {chip.label}
              </span>
            ))}
          </div>

          {/* buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => window.print()}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 12,
                background: "transparent", border: `1px solid ${T.b2}`,
                color: T.text2, fontSize: 12, fontWeight: 700, cursor: "pointer",
                transition: "border-color .2s, color .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.b3; e.currentTarget.style.color = T.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.b2; e.currentTarget.style.color = T.text2; }}
            >
              <Printer size={15} />
              Print
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px", borderRadius: 12,
                background: T.cyan, border: "none",
                color: "#05080a", fontSize: 12, fontWeight: 700,
                cursor: downloading ? "not-allowed" : "pointer",
                opacity: downloading ? .6 : 1,
                transition: "opacity .2s, transform .15s",
              }}
              onMouseEnter={(e) => { if (!downloading) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Download size={15} />
              {downloading ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>

        {/* ── page content ────────────────────────────────── */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 100px" }}>

          {/* ── employee header card ── */}
          <div style={{
            background: T.s1, border: `1px solid ${T.b1}`,
            borderRadius: 20, padding: "28px 26px", marginBottom: 16,
            position: "relative", overflow: "hidden",
          }}>
            {/* shimmer top */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${T.cyanS}, transparent)`,
            }} />

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24, alignItems: "flex-start" }}>
              {/* left */}
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: T.cyanD, border: `2px solid ${T.cyanS}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.8rem", fontWeight: 700, color: T.cyan, flexShrink: 0,
                }}>
                  {profile.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: T.text, lineHeight: 1.1, marginBottom: 8 }}>
                    {profile.fullName}
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {[
                      { icon: MapPin,     text: `${profile.city} · ${cap(profile.cityType)}` },
                      { icon: Briefcase,  text: cap(profile.employmentType || "Salaried")     },
                      { icon: User,       text: `Age ${profile.age}`                          },
                      { icon: Award,      text: `${cap(profile.riskAppetite)} Risk`           },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: T.text2 }}>
                        <Icon size={12} color={T.text3} />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* right */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: T.text3, marginBottom: 6 }}>
                  Assessment Year
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.6rem", fontWeight: 600, color: T.amber }}>
                  {currentYear}
                </div>
                <div style={{ fontSize: 11, color: T.text3, marginTop: 6, display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                  <Calendar size={11} />
                  Full-year salaried employee
                </div>
                {profile.yearsToRetirement && (
                  <div style={{ marginTop: 8, fontSize: 11, color: T.text3 }}>
                    {profile.yearsToRetirement} yrs to retirement
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── section 01: salary summary ── */}
          <Section>
            <SectionHeader number="01" title="Salary Summary" icon={Building2} color={T.cyan} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 20 }}>
              <MetricCard label="Gross Annual Salary" value={fmt(tax.grossAnnualSalary)} color={T.text} />
              <MetricCard label="Annual Basic"         value={fmt(annualBasic)}           color={T.text} />
              <MetricCard label="HRA Component"        value={fmt(annualHra)}             color={T.amber} />
              <MetricCard label="HRA Exemption"        value={fmt(tax.hraExemption)}      color={T.cyan}
                sub="Tax-free amount" />
            </div>
            <div style={{ background: T.s2, border: `1px solid ${T.b1}`, borderRadius: 14, overflow: "hidden" }}>
              {/* table header */}
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr",
                gap: 12, padding: "11px 16px",
                background: T.s3, borderBottom: `1px solid ${T.b1}`,
              }}>
                {["Component", "Annual Amount", "Tax Treatment"].map((h) => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: T.text3 }}>{h}</span>
                ))}
              </div>
              <DataRow label="Basic Salary"       value={fmt(annualBasic)}   tag="Taxable"           tagColor={T.rose}   />
              <DataRow label="HRA Allowance"       value={fmt(annualHra)}     tag="Partially Exempt"  tagColor={T.amber}  />
              <DataRow label="Special Allowance"   value={fmt(annualSpecial)} tag="Taxable"           tagColor={T.rose}   />
              <DataRow label="Annual Bonus"        value={fmt(annualBonus)}   tag="Taxable"           tagColor={T.rose}   />
              <DataRow label="Employer PF"         value={fmt(annualPF)}      tag="Retirement"        tagColor={T.cyan}   last />
            </div>
          </Section>

          {/* ── section 02: regime comparison ── */}
          <Section>
            <SectionHeader number="02" title="Tax Regime Comparison" icon={TrendingDown} color={T.amber} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <RegimeCard title="Old Regime" tax={tax.taxOldRegime} income={tax.taxableIncomeOld} recommended={isOldBetter} />
              <RegimeCard title="New Regime" tax={tax.taxNewRegime} income={tax.taxableIncomeNew} recommended={!isOldBetter} />
            </div>
            <div style={{
              background: T.s2, border: `1px solid ${T.b1}`,
              borderRadius: 14, padding: "16px 18px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.cyan, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.text2 }}>
                <strong style={{ color: T.text }}>{isOldBetter ? "Old Regime" : "New Regime"}</strong> is recommended —
                saves you <strong style={{ color: T.cyan }}>{fmt(Math.abs((tax.taxOldRegime || 0) - (tax.taxNewRegime || 0)))}</strong> more in tax.
              </span>
            </div>
          </Section>

          {/* ── section 03: deduction gap analysis ── */}
          <Section>
            <SectionHeader number="03" title="Deduction Gap Analysis" icon={Shield} color={T.violet} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <GapBar label="80C Investments" used={150000 - (tax.gap80C || 0)} total={150000}  color={T.cyan}   />
              <GapBar label="80D Health Ins." used={25000  - (tax.gap80D || 0)} total={25000}   color={T.amber}  />
              <GapBar label="NPS 80CCD(1B)"   used={50000  - (tax.gapNPS || 0)} total={50000}   color={T.violet} />
            </div>
          </Section>

          {/* ── section 04: ML suggestions ── */}
          <Section>
            <SectionHeader number="04" title="ML Personalised Suggestions" icon={Sparkles} color={T.cyan} />
            {!suggestion ? (
              <div style={{ textAlign: "center", padding: "24px 0", fontSize: 13, color: T.text3 }}>
                No suggestions available — run tax calculation to generate ML advice.
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
                  {suggestion.suggest80C && (
                    <SuggestionCard
                      icon={PiggyBank} color={T.cyan}
                      section="Section 80C" title="Investment Deductions"
                      saving={suggestion.saving80C}
                      instrument={suggestion.best80CInstrument}
                    />
                  )}
                  {suggestion.suggest80D && (
                    <SuggestionCard
                      icon={HeartPulse} color={T.amber}
                      section="Section 80D" title="Health Insurance"
                      saving={suggestion.saving80D}
                      instrument="Family Health Policy"
                    />
                  )}
                  {suggestion.suggestNPS && (
                    <SuggestionCard
                      icon={Shield} color={T.violet}
                      section="80CCD(1B)" title="NPS Contribution"
                      saving={suggestion.savingNPS}
                      instrument="National Pension Scheme"
                    />
                  )}
                </div>

                {/* total saving summary */}
                <div style={{
                  background: `${T.cyan}08`, border: `1px solid ${T.cyanS}`,
                  borderRadius: 14, padding: "18px 20px",
                  display: "flex", flexWrap: "wrap", justifyContent: "space-between",
                  alignItems: "center", gap: 14,
                }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: T.text3, marginBottom: 6 }}>
                      Total Additional Tax Saving (ML)
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.8rem", fontWeight: 600, color: T.cyan }}>
                      {fmt(totalSuggestionSaving)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: T.text3, marginBottom: 4 }}>
                      Recommended regime
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: T.amber }}>
                      {cap(suggestion.regimeRecommendation)} Regime
                    </div>
                    {suggestion.confidenceScore && (
                      <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
                        Confidence: {Math.round(suggestion.confidenceScore * 100)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* priority order */}
                {suggestion.priorityOrder?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: T.text3, marginBottom: 10 }}>
                      Action Priority Order
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {suggestion.priorityOrder.map((item, i) => (
                        <div key={item} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 16px", borderRadius: 100,
                          background: T.s2, border: `1px solid ${T.b2}`,
                          fontSize: 12, fontWeight: 600, color: T.text2,
                        }}>
                          <span style={{
                            width: 20, height: 20, borderRadius: "50%",
                            background: T.cyanD, border: `1px solid ${T.cyanS}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.cyan,
                          }}>{i + 1}</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Section>

          {/* ── section 05: document checklist ── */}
          <Section>
            <SectionHeader number="05" title="Document Checklist" icon={CheckCircle2} color={T.green} />
            <div style={{ background: T.s2, border: `1px solid ${T.b1}`, borderRadius: 14, overflow: "hidden" }}>
              {docChecklist.map((d, i) => (
                <DocCheckRow key={d.label} label={d.label} status={d.status} last={i === docChecklist.length - 1} />
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "12px 16px", background: T.s2, border: `1px solid ${T.b1}`, borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: T.text3, lineHeight: 1.7 }}>
                <strong style={{ color: T.text2 }}>Note:</strong> Submit this report to HR/Payroll by the investment declaration deadline.
                HR will revise your monthly TDS based on the declared investments — your in-hand salary will increase from the next pay cycle.
              </div>
            </div>
          </Section>

        </div>

        {/* ── fixed bottom download button ── */}
        <div
          className="no-print"
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 60,
          }}
        >
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 10px", fontSize: 14, borderRadius: 14,
              background: `linear-gradient(135deg, ${T.cyan}, #3d9cf5)`,
              border: "none",
              color: "#05080a", fontSize: 13, fontWeight: 800,
              cursor: downloading ? "not-allowed" : "pointer",
              opacity: downloading ? .6 : 1,
              boxShadow: `0 8px 32px ${T.cyan}40`,
              transition: "transform .2s, box-shadow .2s, opacity .2s",
              letterSpacing: ".02em",
            }}
            onMouseEnter={(e) => {
              if (!downloading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 14px 40px ${T.cyan}55`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 32px ${T.cyan}40`;
            }}
          >
            <Download size={15} />
            {downloading ? "Generating PDF…" : "Download Report"}
          </button>
        </div>

      </section>
    </>
  );
}