import { useState } from "react";
import api from "../../services/api";

export default function SalaryConfirm({ extractedData, onConfirmed }) {
  const [formData, setFormData] = useState({
    financialYear: extractedData.financialYear,
    basicSalary: extractedData.basicSalary || 0,
    hra: extractedData.hra || 0,
    specialAllowance: extractedData.specialAllowance || 0,
    bonus: extractedData.bonus || 0,
    employerPF: extractedData.employerPF || 0,
    companyInsurance: extractedData.companyInsurance || 0,
    grossSalary: extractedData.grossSalary || 0,
    salarySlipS3Key: extractedData.salarySlipS3Key,
    ocrConfidence: extractedData.ocrConfidence || 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/salary/confirm", formData);

      alert("Salary data saved successfully");

      onConfirmed?.(res.data.salaryRecord);
    } catch (error) {
      alert(error.response?.data?.message || "Salary confirmation failed");
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-[#27332f] bg-[#0b1110] p-6">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#c9933a]">
        OCR Confirmation
      </p>

      <h2 className="mt-3 text-[24px] font-extrabold text-[#e8f0ec]">
        Confirm Extracted Salary Details
      </h2>

      <p className="mt-2 text-[13px] text-[#7f8b85]">
        Textract filled these values. Please correct if needed before saving.
      </p>

      <form onSubmit={handleConfirm} className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Basic Salary" name="basicSalary" value={formData.basicSalary} onChange={handleChange} />
        <Input label="HRA" name="hra" value={formData.hra} onChange={handleChange} />
        <Input label="Special Allowance" name="specialAllowance" value={formData.specialAllowance} onChange={handleChange} />
        <Input label="Bonus" name="bonus" value={formData.bonus} onChange={handleChange} />
        <Input label="Employer PF" name="employerPF" value={formData.employerPF} onChange={handleChange} />
        <Input label="Company Insurance" name="companyInsurance" value={formData.companyInsurance} onChange={handleChange} />
        <Input label="Gross Salary" name="grossSalary" value={formData.grossSalary} onChange={handleChange} />

        <div>
          <label className="mb-2 block text-[12px] font-bold text-[#e8f0ec]">
            OCR Confidence
          </label>
          <input
            value={`${formData.ocrConfidence}%`}
            disabled
            className="w-full rounded-xl border border-[#27332f] bg-[#111917] px-4 py-3 text-[13px] text-[#7f8b85]"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] py-4 text-[13px] font-extrabold text-[#07100d]"
          >
            Confirm & Save Salary Data
          </button>
          
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-bold text-[#e8f0ec]">
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#27332f] bg-[#111917] px-4 py-3 text-[13px] text-[#e8f0ec] outline-none"
      />
    </div>
  );
}