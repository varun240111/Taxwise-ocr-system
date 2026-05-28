import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import api from "../../services/api";

const PALETTE = {
  cyan: { hex: "#1de8c8", dim: "#1de8c818", soft: "#1de8c840", ring: "#1de8c822" },
  amber: { hex: "#f5a623", dim: "#f5a62318", soft: "#f5a62340", ring: "#f5a62322" },
  violet: { hex: "#a78bfa", dim: "#a78bfa18", soft: "#a78bfa40", ring: "#a78bfa22" },
  blue: { hex: "#3d9cf5", dim: "#3d9cf520", soft: "#3d9cf540", ring: "#3d9cf522" },
  rose: { hex: "#f54f6d", dim: "#f54f6d18", soft: "#f54f6d40", ring: "#f54f6d22" },
};

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <path d="M19 5s-3 2-7 2-7-2-7-2v8c0 2.21 3.13 4 7 4s7-1.79 7-4V5z" />
      <path d="M5 10s3 2 7 2 7-2 7-2" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconNps() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <rect x={3} y={3} width={18} height={18} rx={3} />
      <path d="M8 12h8M8 8h4M8 16h6" />
    </svg>
  );
}

function useAnimatedNumber(target, duration = 500) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const startTime = performance.now();
    cancelAnimationFrame(rafRef.current);

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      setDisplay(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = target;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

const R = 75;
const CX = 100;
const CY = 100;
const CIRC = 2 * Math.PI * R;

function DonutChart({ sections, activeSet, total, maxTotal }) {
  const pct = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  const animatedPct = useAnimatedNumber(pct);

  const segments = [];
  let offset = 0;

  sections.forEach((s) => {
    const isActive = activeSet.has(s.id);
    const proportion = maxTotal > 0 && isActive ? s.saving / maxTotal : 0;
    const dash = proportion * CIRC;
    const gap = CIRC - dash;

    segments.push({
      id: s.id,
      color: PALETTE[s.color].hex,
      dash,
      gap,
      offset: -offset,
      isActive,
    });

    if (isActive) offset += dash;
  });

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 240, margin: "0 auto 24px" }}>
      <svg viewBox="0 0 200 200" style={{ width: "100%", overflow: "visible" }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#1e3028" strokeWidth={22} />

        {segments.map((seg) => (
          <circle
            key={seg.id}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={seg.isActive ? 22 : 18}
            strokeLinecap="round"
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={seg.offset}
            opacity={seg.isActive ? 1 : 0.15}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "100px 100px",
              transition: "stroke-dasharray 0.65s cubic-bezier(0.4,0,0.2,1), stroke-dashoffset 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.35s, stroke-width 0.2s",
            }}
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1.9rem",
            fontWeight: 600,
            color: "#dde8f0",
            lineHeight: 1,
          }}
        >
          {animatedPct}%
        </span>

        <span style={{ fontSize: 10, color: "#3d5468", fontWeight: 600, letterSpacing: ".1em", marginTop: 4, textTransform: "uppercase" }}>
          of max
        </span>
      </div>
    </div>
  );
}

function LegendRow({ section, isActive, onToggle }) {
  const p = PALETTE[section.color];

  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 10px",
        borderRadius: 10,
        cursor: "pointer",
        opacity: isActive ? 1 : 0.4,
        transition: "opacity 0.3s, background 0.2s",
        background: "transparent",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#0d1318")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.hex, flexShrink: 0 }} />

      <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: isActive ? "#8fa89a" : "#3d5468" }}>
        {section.title}
      </span>

      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: isActive ? "#dde8f0" : "#3d5468" }}>
        ₹{section.saving.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function FeatureCard({ section, isActive, onSingleClick, onDoubleClick }) {
  const p = PALETTE[section.color];
  const clickTimer = useRef(null);

  const handleClick = useCallback(() => {
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      if (isActive) onSingleClick(section.id);
    }, 220);
  }, [isActive, onSingleClick, section.id]);

  const handleDoubleClick = useCallback(() => {
    clearTimeout(clickTimer.current);
    onDoubleClick(section.id);
  }, [onDoubleClick, section.id]);

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        position: "relative",
        background: "#090e12",
        border: `1px solid ${isActive ? "#1e3028" : "#111820"}`,
        borderRadius: 20,
        padding: "20px 22px",
        cursor: "pointer",
        opacity: isActive ? 1 : 0.38,
        filter: isActive ? "none" : "grayscale(0.5)",
        transition: "opacity 0.3s, border-color 0.25s, transform 0.25s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.25s",
        overflow: "hidden",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        if (isActive) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 40px #00000040";
          e.currentTarget.style.borderColor = "#253545";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = isActive ? "#1e3028" : "#111820";
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: p.hex,
          opacity: isActive ? 0.7 : 0.15,
          borderRadius: "3px 0 0 3px",
          transition: "opacity 0.3s",
        }}
      />

      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${p.dim} 0%, transparent 55%)`,
            borderRadius: 20,
            pointerEvents: "none",
          }}
        />
      )}

      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${p.soft}, transparent)`,
            borderRadius: "20px 20px 0 0",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          padding: "3px 10px",
          borderRadius: 100,
          background: isActive ? p.dim : "#ffffff08",
          color: isActive ? p.hex : "#3d5468",
          border: `1px solid ${isActive ? p.ring : "#172030"}`,
          transition: "all 0.3s",
        }}
      >
        {isActive ? "Active" : "Removed"}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, position: "relative" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: p.dim,
            border: `1px solid ${p.soft}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: p.hex,
          }}
        >
          {section.icon}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: p.hex, marginBottom: 4 }}>
            {section.section}
          </div>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#dde8f0", lineHeight: 1.2 }}>
            {section.title}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "#0d1318",
          borderRadius: 12,
          border: "1px solid #172030",
          marginBottom: 12,
          position: "relative",
        }}
      >
        <span style={{ fontSize: 11, color: "#3d5468", fontWeight: 600 }}>Tax Saving</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color: p.hex, letterSpacing: "-.02em" }}>
          ₹{section.saving.toLocaleString("en-IN")}
        </span>
      </div>

      <p style={{ fontSize: 12, color: "#7a9ab0", lineHeight: 1.65, position: "relative" }}>
        {section.desc}
      </p>

      <div style={{ marginTop: 10, fontSize: 10, color: "#3d5468", display: "flex", alignItems: "center", gap: 5, position: "relative" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={11} height={11}>
          <circle cx={12} cy={12} r={10} />
          <line x1={12} y1={8} x2={12} y2={12} />
          <line x1={12} y1={16} x2={12.01} y2={16} />
        </svg>
        {isActive ? "Single click to remove from total" : "Double-click to add back"}
      </div>
    </div>
  );
}

export default function TaxAnalytics() {
  const [loading, setLoading] = useState(true);
  const [tax, setTax] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taxRes = await api.get("/tax/latest");
        setTax(taxRes.data.result || null);

        try {
          const suggestionRes = await api.get("/suggestions/latest");
          setSuggestion(suggestionRes.data.suggestion || null);
        } catch {
          setSuggestion(null);
        }
      } catch {
        setTax(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sections = useMemo(() => {
    if (!tax && !suggestion) return [];

    const list = [];

    if (suggestion?.suggest80C) {
      list.push({
        id: "80C",
        color: "cyan",
        saving: Number(suggestion.saving80C || 0),
        section: "Section 80C",
        title: "Investment Deductions",
        desc: `${suggestion.best80CInstrument === "SSY" ? "Sukanya Samriddhi Yojana" : suggestion.best80CInstrument || "ELSS / PPF"} is suggested based on your profile. This fills your 80C gap and reduces taxable income.`,
        icon: <IconShield />,
      });
    }

    if (suggestion?.suggest80D) {
      list.push({
        id: "80D",
        color: "amber",
        saving: Number(suggestion.saving80D || 0),
        section: "Section 80D",
        title: "Health Insurance",
        desc: "Health insurance premium can reduce taxable income while improving financial protection for self and family.",
        icon: <IconHeart />,
      });
    }

    if (suggestion?.suggestNPS) {
      list.push({
        id: "NPS",
        color: "violet",
        saving: Number(suggestion.savingNPS || 0),
        section: "Section 80CCD(1B)",
        title: "NPS Contribution",
        desc: "NPS gives extra ₹50,000 deduction outside 80C and helps build retirement corpus.",
        icon: <IconNps />,
      });
    }

    if (Number(tax?.hraExemption || 0) > 0) {
      list.push({
        id: "HRA",
        color: "blue",
        saving: Math.round(Number(tax.hraExemption || 0) * 0.1),
        section: "HRA Exemption",
        title: "House Rent Allowance",
        desc: "HRA exemption is calculated using rent paid, basic salary, HRA received, and city type.",
        icon: <IconHome />,
      });
    }

    if (Number(tax?.totalOldDeductions || 0) > 0) {
      list.push({
        id: "STD",
        color: "rose",
        saving: 5000,
        section: "Standard Deduction",
        title: "Standard Deduction",
        desc: "Standard deduction is automatically available for salaried employees and reduces taxable income.",
        icon: <IconDoc />,
      });
    }

    return list.filter((item) => item.saving > 0);
  }, [tax, suggestion]);

  const [activeSet, setActiveSet] = useState(new Set());

  useEffect(() => {
    setActiveSet(new Set(sections.map((s) => s.id)));
  }, [sections.length]);

  const maxTotal = sections.reduce((a, s) => a + s.saving, 0);
  const total = sections.reduce((a, s) => (activeSet.has(s.id) ? a + s.saving : a), 0);
  const animatedTotal = useAnimatedNumber(total);

  const handleSingleClick = useCallback((id) => {
    setActiveSet((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleDoubleClick = useCallback((id) => {
    setActiveSet((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const toggleFromLegend = useCallback((id) => {
    setActiveSet((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const activeCount = activeSet.size;
  const barPct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

  if (loading) {
    return <section style={{ padding: 24, color: "#dde8f0" }}>Loading analytics...</section>;
  }

  if (!tax) {
    return (
      <section style={{ padding: 24, color: "#dde8f0" }}>
        <div style={{ background: "#090e12", border: "1px solid #172030", borderRadius: 24, padding: 30, textAlign: "center" }}>
          <h1>No Analytics Yet</h1>
          <p style={{ color: "#7a9ab0" }}>First calculate tax to unlock analytics.</p>
        </div>
      </section>
    );
  }

  if (sections.length === 0) {
    return (
      <section style={{ padding: 24, color: "#dde8f0" }}>
        <div style={{ background: "#090e12", border: "1px solid #172030", borderRadius: 24, padding: 30, textAlign: "center" }}>
          <h1>No Saving Suggestions Found</h1>
          <p style={{ color: "#7a9ab0" }}>Your tax plan is balanced or suggestions are not generated yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ minHeight: "calc(100vh - 112px)", padding: "28px 20px 60px", color: "#dde8f0", fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 13px",
            borderRadius: 100,
            background: "#3d9cf520",
            border: "1px solid #3d9cf540",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "#3d9cf5",
            marginBottom: 14,
          }}
        >
          Tax Analytics
        </div>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            letterSpacing: "-.02em",
            lineHeight: 1.05,
            background: "linear-gradient(140deg, #dde8f0 0%, #7a9ab0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Tax Saving Breakdown
        </h1>

        <p style={{ fontSize: 12, color: "#3d5468", marginTop: 8, lineHeight: 1.7, fontWeight: 500, maxWidth: 420 }}>
          See how each real suggestion contributes to your total saving.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            fontSize: 11,
            color: "#3d5468",
            background: "#090e12",
            border: "1px solid #172030",
            borderRadius: 8,
            padding: "5px 12px",
          }}
        >
          <span style={{ color: "#1de8c8", fontWeight: 700 }}>Click</span> to remove ·
          <span style={{ color: "#1de8c8", fontWeight: 700 }}>Double-click</span> to add back
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#090e12",
            border: "1px solid #172030",
            borderRadius: 24,
            padding: "28px 24px",
            position: "sticky",
            top: 24,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "#3d5468", marginBottom: 4 }}>
            Total Tax Saving
          </div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.3rem", fontWeight: 600, color: "#1de8c8", lineHeight: 1 }}>
            ₹{animatedTotal.toLocaleString("en-IN")}
          </div>

          <div style={{ fontSize: 11.5, color: "#7a9ab0", marginTop: 6, marginBottom: 22, lineHeight: 1.6 }}>
            {activeCount} of {sections.length} sections active
          </div>

          <DonutChart sections={sections} activeSet={activeSet} total={total} maxTotal={maxTotal} />

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sections.map((s) => (
              <LegendRow
                key={s.id}
                section={s}
                isActive={activeSet.has(s.id)}
                onToggle={() => toggleFromLegend(s.id)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sections.map((s) => (
            <FeatureCard
              key={s.id}
              section={s}
              isActive={activeSet.has(s.id)}
              onSingleClick={handleSingleClick}
              onDoubleClick={handleDoubleClick}
            />
          ))}

          <div
            style={{
              background: "#0d1318",
              border: "1px solid #1e3028",
              borderRadius: 20,
              padding: "20px 22px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#3d5468" }}>
                Active Total Saving
              </div>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.5rem", fontWeight: 600, color: "#1de8c8" }}>
                ₹{animatedTotal.toLocaleString("en-IN")}
              </div>
            </div>

            <div style={{ height: 6, background: "#172030", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
              <div
                style={{
                  height: "100%",
                  width: `${barPct}%`,
                  background: "linear-gradient(90deg, #1de8c8, #3d9cf5)",
                  borderRadius: 3,
                  transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>

            <div style={{ fontSize: 11, color: "#3d5468", lineHeight: 1.5 }}>
              {total === 0
                ? "All sections removed — double-click any card to restore"
                : total === maxTotal
                ? `All ${sections.length} sections active — maximum saving unlocked!`
                : `${activeCount} of ${sections.length} sections contributing · ₹${(maxTotal - total).toLocaleString("en-IN")} more possible`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}