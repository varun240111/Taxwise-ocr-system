import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
import MyTaxPlan from "../plan/MyTaxPlan.jsx";
import TaxAnalytics from "../analytics/TaxAnalytics.jsx";
import HRReport from "../reports/HRReport.jsx";
import SalaryUpload from "../salary/SalaryUpload.jsx";
import ProfileSetup from "../profile/ProfileSetup.jsx";
import SalaryRecords from "../salary/SalaryRecords.jsx";
import TaxCalculator from "../tax/TaxCalculator.jsx";
import SettingsPage from "../settings/Settings.jsx";
import Mydocuments from "../documents/Mydocuments.jsx"
import { CircleHelp } from "lucide-react";


import {
  Calculator,
  FileText,
  FolderOpen,
  LockKeyhole,
  Settings,
  Sparkles,
  UploadCloud,
  ArrowRight,
  BarChart3,
} from "lucide-react";

import DashboardLayout from "./DashboardLayout";
import EmptyDashboard from "./EmptyDashboard";

export default function Dashboard() {
  const token = useSelector((state) => state.auth.token);
  const [taxRefreshKey, setTaxRefreshKey] = useState(0);    
  const [activePage, setActivePage] = useState("dashboard");

  const [profileCompleted, setProfileCompleted] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const [salaryUploaded, setSalaryUploaded] = useState(false);
  const [checkingSalary, setCheckingSalary] = useState(true);
  useEffect(() => {
    const handleMenuNavigation = (event) => {
      setActivePage(event.detail);
    };

    window.addEventListener("taxwise:navigate", handleMenuNavigation);

    return () => {
      window.removeEventListener("taxwise:navigate", handleMenuNavigation);
    };
  }, []);
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await api.get("/profile/check");
        setProfileCompleted(response.data.profileExists);
      } catch (error) {
        console.log(error);
        setProfileCompleted(false);
      } finally {
        setCheckingProfile(false);
      }
    };

    const checkSalary = async () => {
      try {
        const response = await api.get("/salary/active");
        setSalaryUploaded(response.data.hasActiveSalary);
      } catch (error) {
        console.log(error);
        setSalaryUploaded(false);
      } finally {
        setCheckingSalary(false);
      }
    };

    if (token) {
      checkProfile();
      checkSalary();
    }
  }, [token]);

  const renderPage = () => {
    if (activePage === "dashboard") {
      return <EmptyDashboard setActivePage={setActivePage} />;
    }

    if (activePage === "upload") {
      if (checkingProfile) {
        return (
          <PageBox
            icon={UploadCloud}
            title="Checking Profile"
            tag="Please wait"
            text="Checking whether your profile is completed."
            button="Loading..."
          />
        );
      }
        if (!profileCompleted) {
        return (
          <ProfileSetup
            setProfileCompleted={setProfileCompleted}
            setActivePage={setActivePage}
            redirectAfterSetup="upload"
          />
        );
      }

      return (
        <SalaryUpload
          onSalarySaved={() => {
            setSalaryUploaded(true);
            setTaxRefreshKey((prev) => prev + 1);
            setActivePage("calculator");
          }}
        />
      );
    }

    if (activePage === "documents") {
        return <Mydocuments />;
      }

    if(activePage === "settings") {
      return <SettingsPage />;
    }
    if (activePage === "profile") {
      return (
        <ProfileSetup
          setProfileCompleted={setProfileCompleted}
          setActivePage={setActivePage}
        />
      );
    }

    if (activePage === "salaryRecords") {
      return (
        <SalaryRecords
          onActiveChanged={() => {
            setSalaryUploaded(true);
            setTaxRefreshKey((prev) => prev + 1);
            setActivePage("calculator");
          }}
        />
      );
    }

    
    if (activePage === "hr") {
      if (!salaryUploaded) {
        return (
          <PageBox
            icon={FileText}
            title="HR Report"
            tag="Locked"
            text="Upload salary slip and calculate tax first."
            button="Upload salary slip first"
            onClick={() => setActivePage("upload")}
            locked
          />
        );
      }

      return <HRReport />;
    }
    if (activePage === "support") {
    return (
      <PageBox
        icon={CircleHelp}
        title="Help & Support"
        tag="Support"
        text="Contact support, read FAQs, and get help with TaxWise Vault."
        button="Back to settings"
        onClick={() => setActivePage("settings")}
      />
    );
  }
   if (activePage === "calculator") {
      if (checkingSalary) {
        return (
          <PageBox
            icon={Calculator}
            title="Checking Salary Data"
            tag="Please wait"
            text="Checking whether active salary receipt is available."
            button="Loading..."
          />
        );
      }

      if (!salaryUploaded) {
        return (
          <SalaryUpload
            onSalarySaved={() => {
              setSalaryUploaded(true);
              setActivePage("calculator");
            }}
          />
        );
      }

      return <TaxCalculator refreshKey={taxRefreshKey} />;
    }
    if (activePage === "plan") {
        if (!salaryUploaded) {
          return (
            <PageBox
              icon={Sparkles}
              title="My Tax Plan"
              tag="Locked"
              text="Upload salary slip and calculate tax first."
              button="Upload salary slip first"
              onClick={() => setActivePage("upload")}
              locked
            />
          );
        }

        return <MyTaxPlan />;
      }
      if (activePage === "analytics") {
      if (!salaryUploaded) {
      return (
        <PageBox
          icon={BarChart3}
          title="Tax Analytics"
          tag="Locked"
          text="Upload salary slip and calculate tax first."
          button="Upload salary slip first"
          onClick={() => setActivePage("upload")}
          locked
        />
      );
    }

    return <TaxAnalytics />;
  }
    const pages = {
      plan: {
        icon: Sparkles,
        title: "My Tax Plan",
        text: "ML-based suggestions unlock after salary analysis.",
      },

      documents: {
        icon: FolderOpen,
        title: "My Documents",
        text: "Documents vault unlocks after tax plan and proof upload step.",
      },

      hr: {
        icon: FileText,
        title: "HR Report",
        text: "HR report unlocks after salary and document proof details.",
      },

      settings: {
        icon: Settings,
        title: "Settings",
        text: "Manage account preferences and security.",
      },
      analytics: {
      icon: BarChart3,
      title: "Tax Analytics",
      text: "Visualize tax comparison, deduction gaps, and savings.",
    },
    };

    const page = pages[activePage];

    if (!page) {
      return <EmptyDashboard setActivePage={setActivePage} />;
    }

    if (!salaryUploaded && activePage !== "settings") {
      return (
        <PageBox
          icon={page.icon}
          title={page.title}
          tag="Locked"
          text={page.text}
          button="Upload salary slip first"
          onClick={() => setActivePage("upload")}
          locked
        />
      );
    }

    return (
      <PageBox
        icon={page.icon}
        title={page.title}
        tag="Ready"
        text={page.text}
        button="Continue"
      />
    );
  };

  return (
    <DashboardLayout
      activePage={activePage}
      setActivePage={setActivePage}
      profileCompleted={profileCompleted}
    >
      {renderPage()}
    </DashboardLayout>
  );
}

function PageBox({ icon: Icon, title, tag, text, button, onClick, locked }) {
  return (
    <section className="min-h-[calc(100vh-112px)] text-[#e8f0ec]">
      <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-2xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_260px_220px_at_20%_15%,#19b98512_0%,transparent_70%),radial-gradient(ellipse_260px_220px_at_90%_85%,#c9933a10_0%,transparent_70%)]" />

        <div className="relative z-10 w-full max-w-[640px] rounded-2xl border border-[#27332f] bg-[#111917] px-8 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#19221f] text-[#c9933a]">
            {locked ? (
              <LockKeyhole size={25} strokeWidth={2.2} />
            ) : (
              <Icon size={25} strokeWidth={2.2} />
            )}
          </div>

          <p className="mt-5 inline-flex rounded-full border border-[#27332f] bg-[#0b1110] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#c9933a]">
            {tag}
          </p>

          <h1 className="mt-5 text-[28px] font-extrabold leading-tight tracking-[-0.4px] text-[#e8f0ec]">
            {title}
          </h1>

          <p className="mx-auto mt-3 max-w-[520px] text-[13px] font-medium leading-6 text-[#7f8b85]">
            {text}
          </p>

          <button
            type="button"
            onClick={onClick}
            className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-5 py-3 text-[13px] font-extrabold text-[#07100d] transition hover:scale-[1.02]"
          >
            {button}
            <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  );
}