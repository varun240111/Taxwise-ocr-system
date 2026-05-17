import { Bell, Search, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";

export default function TopNavbar({ title, subtitle }) {
  const user = useSelector((state) => state.auth.user);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TV";

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-[#1e2c27] bg-[#0b1110]/95 px-6 text-[#e8f0ec] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-5">
        {/* LEFT TITLE */}
        <div className="min-w-0">
          <h2 className="truncate text-[18px] font-extrabold tracking-[-0.3px] text-[#e8f0ec]">
            {title}
          </h2>

          <p className="mt-0.5 truncate text-[12px] font-semibold text-[#7f8b85]">
            {subtitle}
          </p>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden flex-1 justify-center lg:flex">
          <div className="flex w-full max-w-[420px] items-center gap-3 rounded-[12px] border border-[#27332f] bg-[#111917] px-4 py-2.5">
            <Search size={17} strokeWidth={2.2} className="text-[#7f8b85]" />

            <input
              type="text"
              placeholder="Search documents, reports..."
              className="w-full bg-transparent text-[13px] font-semibold text-[#e8f0ec] outline-none placeholder:text-[#4a5550]"
            />
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            className="relative flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[11px] border border-[#27332f] bg-[#111917] text-[#b8c2bc] transition hover:bg-[#141d1a] hover:text-[#e8f0ec]"
          >
            <Bell size={17} strokeWidth={2.2} />

            <span className="absolute right-2.5 top-2.5 h-[7px] w-[7px] rounded-full bg-[#19b985]" />
          </button>

          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#e9ddff] text-[12px] font-extrabold text-[#4a2a88]">
            {initials}
          </div>

          <button
            type="button"
            className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[11px] border border-[#27332f] bg-[#111917] text-[#b8c2bc] transition hover:bg-[#141d1a] hover:text-[#e8f0ec]"
          >
            <MoreHorizontal size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </header>
  );
}