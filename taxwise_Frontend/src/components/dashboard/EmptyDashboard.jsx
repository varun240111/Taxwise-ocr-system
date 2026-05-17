import {
  ArrowRight,
  BrainCircuit,
  FileText,
  LockKeyhole,
  UploadCloud,
  UserRoundCheck,
  ShieldCheck,
} from "lucide-react";

export default function EmptyDashboard({ setActivePage }) {
  return (
    <section className="min-h-[calc(100vh-112px)] text-[#e8f0ec]">
      <div className="relative overflow-hidden rounded-2xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_260px_220px_at_20%_10%,#19b98512_0%,transparent_70%),radial-gradient(ellipse_260px_220px_at_90%_90%,#c9933a10_0%,transparent_70%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT HERO */}
          <div className="rounded-2xl border border-[#27332f] bg-[#111917] p-7">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#19b985]">
              <ShieldCheck size={14} strokeWidth={2.4} />
              Waiting for salary data
            </p>

            <h1 className="max-w-3xl text-[34px] font-extrabold leading-tight tracking-[-0.5px] text-[#e8f0ec] md:text-[46px]">
              Tax insights unlock after{" "}
              <span className="text-[#c9933a]">salary slip upload.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-[13px] font-medium leading-6 text-[#7f8b85]">
              We do not show fake tax, investment, profit or saving numbers
              before analyzing your salary. Upload salary slip first, then
              TaxWise will calculate tax, detect gaps, and generate your ML tax
              plan.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActivePage("upload")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-5 py-3 text-[13px] font-extrabold text-[#07100d] transition hover:scale-[1.02]"
              >
                Upload salary slip
                <ArrowRight size={16} strokeWidth={2.4} />
              </button>

              <button
                type="button"
                onClick={() => setActivePage("profile")}
                className="cursor-pointer rounded-xl border border-[#27332f] bg-[#0b1110] px-5 py-3 text-[13px] font-bold text-[#e8f0ec] transition hover:bg-[#141d1a]"
              >
                Setup profile
              </button>
            </div>
          </div>

          {/* RIGHT WORKFLOW */}
          <div className="rounded-2xl border border-[#27332f] bg-[#111917] p-6">
            <h3 className="text-[18px] font-extrabold tracking-[-0.3px] text-[#e8f0ec]">
              Unlock workflow
            </h3>

            <p className="mt-1.5 text-[12px] font-medium leading-5 text-[#7f8b85]">
              Dashboard changes based on real salary data only.
            </p>

            <div className="mt-6 space-y-4">
              <Step
                icon={UserRoundCheck}
                title="Profile check"
                text="If profile is incomplete, user goes to profile setup."
              />
              <Step
                icon={UploadCloud}
                title="Upload salary receipt"
                text="User uploads salary slip PDF or image."
              />
              <Step
                icon={BrainCircuit}
                title="Rule engine + ML"
                text="Tax calculation and suggestions start."
              />
              <Step
                icon={FileText}
                title="Dashboard unlock"
                text="Tax cards, plans and reports become active."
              />
            </div>
          </div>
        </div>
      </div>

      {/* LOCKED CARDS */}
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LockedCard title="Current Tax" />
        <LockedCard title="Possible Saving" />
        <LockedCard title="Investment Plan" />
        <LockedCard title="HR Report" />
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