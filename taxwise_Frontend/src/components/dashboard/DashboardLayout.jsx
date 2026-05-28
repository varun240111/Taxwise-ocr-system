import { useState } from "react";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const pageMeta = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Your TaxWise command center",
  },
  upload: {
    title: "Upload Salary Slip",
    subtitle: "Upload receipt and start salary analysis",
  },
  calculator: {
    title: "Tax Calculator",
    subtitle: "Compare old and new tax regimes",
  },
  salaryRecords: {
    title: "Salary Records",
    subtitle: "Manage active and inactive salary receipts",
  },
  plan: {
    title: "My Tax Plan",
    subtitle: "AI-powered investment suggestions",
  },
  analytics: {
    title: "Tax Analytics",
    subtitle: "Visualize tax comparison and savings",
  },
  documents: {
    title: "My Documents",
    subtitle: "Your salary slips and tax proofs",
  },
  hr: {
    title: "HR Report",
    subtitle: "Generate declaration report",
  },
  profile: {
    title: "My Profile",
    subtitle: "Personal and financial profile",
  },
  settings: {
    title: "Settings",
    subtitle: "Preferences and account controls",
  },
};

export default function DashboardLayout({
  activePage,
  setActivePage,
  profileCompleted,
  children,
}) {
  const user = useSelector((state) => state.auth.user);
  const meta = pageMeta[activePage] || pageMeta.dashboard;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-[#060908]">
      <div className="mx-auto flex h-screen w-full max-w-[1500px] overflow-hidden border-x border-[#27332f] bg-[#0b1110]">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          profileCompleted={profileCompleted}
        />

        <section className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center gap-3 border-b border-[#27332f] bg-[#0b1110]">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#27332f] bg-[#111917] text-[#e8f0ec] lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <TopNavbar title={meta.title} subtitle={meta.subtitle} />
            </div>
          </div>

          <main className="main-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#0b1110] p-6">
            {children}
          </main>
        </section>
      </div>
    </div>
  );
}