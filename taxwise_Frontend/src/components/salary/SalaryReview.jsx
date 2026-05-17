import { useState,useEffect } from "react";
import MoreTaxDetails from "./MoreTaxDetails.jsx";
import api from "../../services/api";
import { ChevronDown } from "lucide-react";

export default function SalaryReview({ extractedData,onSalarySaved  }) {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    ...extractedData,

    rentPaid: "",
    cityOfResidence: "",
    landlordName: "",

    hasHomeLoan: false,
    homeLoanInterest: "",

    hasEducationLoan: false,
    educationLoanInterest: "",

    existing80C: "",
    existing80D: "",
    existingNPS: "",
    existing80G: "",
  });

  const [hasPreviousTaxDetails, setHasPreviousTaxDetails] = useState(false);

useEffect(() => {
  const fetchPreviousTaxDetails = async () => {
    try {
      const res = await api.get("/profile/me");

      const profile = res.data.profile;

      const hasOldData =
        profile.rentPaid ||
        profile.cityOfResidence ||
        profile.landlordName ||
        profile.homeLoanInterest ||
        profile.educationLoanInterest ||
        profile.existing80C ||
        profile.existing80D ||
        profile.existingNPS ||
        profile.existing80G;

      setHasPreviousTaxDetails(!!hasOldData);

      setFormData((prev) => ({
        ...prev,

        rentPaid: profile.rentPaid || "",
        cityOfResidence: profile.cityOfResidence || "",
        landlordName: profile.landlordName || "",

        hasHomeLoan: profile.hasHomeLoan || false,
        homeLoanInterest: profile.homeLoanInterest || "",

        hasEducationLoan: profile.hasEducationLoan || false,
        educationLoanInterest: profile.educationLoanInterest || "",

        existing80C: profile.existing80C || "",
        existing80D: profile.existing80D || "",
        existingNPS: profile.existingNPS || "",
        existing80G: profile.existing80G || "",
      }));
    } catch (error) {
      console.log("Previous tax details not found", error);
    }
  };

  fetchPreviousTaxDetails();
}, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleConfirm = async () => {
    try {
      setSaving(true);

      await api.post("/salary/confirm", formData);
      await api.patch("/profile/tax-details", formData);

      alert("Salary data saved successfully");
      onSalarySaved?.();
    } catch (error) {
      alert(error.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

 return (
  <section className="h-[calc(100vh-90px)] overflow-hidden bg-[#0b1110] p-6 text-[#e8f0ec]">
    <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#27332f] bg-[#111917]">
      {/* HEADER */}
      <div className="shrink-0 border-b border-[#27332f] p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#19b985]">
              OCR REVIEW
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">
              Review Salary Details
            </h1>

            <p className="mt-2 text-sm text-[#7f8b85]">
              Verify OCR extracted values before saving.
            </p>
          </div>

          <div className="rounded-2xl border border-[#27332f] bg-[#0b1110] px-5 py-4">
            <p className="text-xs text-[#7f8b85]">OCR Confidence</p>

            <h2 className="mt-1 text-2xl font-black text-[#19b985]">
              {formData.ocrConfidence}%
            </h2>
          </div>
        </div>
      </div>

      {/* INTERNAL SCROLL BODY */}
      <div className="min-h-0 flex-1 overflow-y-auto p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Basic Salary" name="basicSalary" value={formData.basicSalary} onChange={handleChange} />
          <Input label="HRA" name="hra" value={formData.hra} onChange={handleChange} />
          <Input label="Special Allowance" name="specialAllowance" value={formData.specialAllowance} onChange={handleChange} />
          <Input label="Bonus" name="bonus" value={formData.bonus} onChange={handleChange} />
          <Input label="Employer PF" name="employerPF" value={formData.employerPF} onChange={handleChange} />
          <Input label="Gross Salary" name="grossSalary" value={formData.grossSalary} onChange={handleChange} />
        </div>

        <button
          type="button"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          className="mt-8 flex items-center gap-3 rounded-xl border border-[#27332f] bg-[#0b1110] px-5 py-3 text-sm font-extrabold transition hover:bg-[#141d1a]"
        >
          <span>
            {showMoreDetails
                ? "Hide More Information"
                : hasPreviousTaxDetails
                ? "Update Tax Information"
                : "Add More Tax Information"
            }
          </span>

          <ChevronDown
            size={18}
            className={`transition duration-300 ${showMoreDetails ? "rotate-180" : ""}`}
          />
        </button>

        {showMoreDetails && (
          <MoreTaxDetails formData={formData} handleChange={handleChange} />
        )}
      </div>

      {/* FOOTER */}
      {showMoreDetails && (
        <div className="shrink-0 border-t border-[#27332f] bg-[#0b1110] p-5">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] py-4 text-sm font-extrabold text-[#07100d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
                ? "Saving..."
                : hasPreviousTaxDetails
                ? "Update Details & Save"
                : "Confirm & Save"
            }
          </button>
        </div>
      )}
    </div>
  </section>
);
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold">{label}</label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm text-[#e8f0ec] outline-none"
      />
    </div>
  );
}