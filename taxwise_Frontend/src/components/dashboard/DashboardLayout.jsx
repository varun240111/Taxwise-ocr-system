import { useSelector } from "react-redux";
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
  plan: {
    title: "My Tax Plan",
    subtitle: "AI-powered investment suggestions",
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
  children,
}) {
  const user = useSelector((state) => state.auth.user);
  const meta = pageMeta[activePage] || pageMeta.dashboard;

  return (
    <div className="h-screen overflow-hidden bg-[#060908]">
      <div className="mx-auto flex h-screen max-w-[1500px] overflow-hidden border-x border-[#27332f] bg-[#0b1110]">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
        />

        <section className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <TopNavbar title={meta.title} subtitle={meta.subtitle} />

          <main className="min-h-0 flex-1 overflow-y-auto bg-[#0b1110]">
            {children}
          </main>
        </section>
      </div>
    </div>
  );
}