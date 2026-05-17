import { useState,useEffect } from "react";
import api from "../../services/api";
import { UploadCloud, FileText, ShieldCheck } from "lucide-react";
import SalaryReview from "./SalaryReview.jsx";
import { useSelector } from "react-redux";


export default function SalaryUpload({onSalarySaved }) {
  const [latestRecord, setLatestRecord] = useState(null);
  const [file, setFile] = useState(null);
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [uploadedData, setUploadedData] = useState(null);

  const [step, setStep] = useState("upload");

  useEffect(() => {
    const fetchLatestSalary = async () => {
      try {
        const response = await api.get("/salary/latest");
        setLatestRecord(response.data.record);
      } catch (error) {
        console.log(error);
      }
    };

     if (token) {
       fetchLatestSalary();
     }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select salary slip");
      return;
    }

    const formData = new FormData();

    formData.append("salarySlip", file);
    formData.append("financialYear", financialYear);

    try {
      setLoading(true);

      const response = await api.post(
        "/salary/upload",
        formData
        // {
        //   headers: {
        //     "Content-Type":
        //       "multipart/form-data",
        //   },
        // }
      );

      setUploadedData({
        ...response.data.extractedSalary,
        financialYear,
        salarySlipS3Key:
          response.data.s3Key,
      });

      setStep("review");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Upload failed"
      );

    } finally {
      setLoading(false);
    }
  };

  if (
    step === "review" &&
    uploadedData
  ) {
    return (
      <SalaryReview
        extractedData={uploadedData}
         onSalarySaved={onSalarySaved}
        onBack={() =>
          setStep("upload")
        }
      />
    );
  }

  return (
    <section className="min-h-[calc(100vh-112px)] text-[#e8f0ec]">

      <div className="rounded-2xl border border-[#1e2c27] bg-[#0b1110] p-6">

        <div className="mx-auto max-w-3xl rounded-2xl border border-[#27332f] bg-[#111917] p-8">

          <p className="inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#19b985]">
            <ShieldCheck size={14} />
            Secure salary upload
          </p>

          <h1 className="mt-5 text-[34px] font-extrabold">
            Upload Salary Slip
          </h1>

          <p className="mt-3 text-[13px] leading-6 text-[#7f8b85]">
            Upload salary slip to start OCR,
            AI tax analysis and deduction planning.
          </p>

          {latestRecord && step === "upload" && (
            <div className="mb-6 rounded-2xl border border-[#27332f] bg-[#0b1110] p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#19b985]">
                Previous Salary Found
              </p>

              <h3 className="mt-2 text-xl font-extrabold">
                Gross Salary: ₹{latestRecord.grossSalary}
              </h3>

              <p className="mt-1 text-sm text-[#7f8b85]">
                Financial Year: {latestRecord.financialYear}
              </p>

              <p className="mt-1 text-sm text-[#7f8b85]">
                You can upload another salary slip. It will be saved as a new salary record.
              </p>
            </div>
          )}
          <form
            onSubmit={handleUpload}
            className="mt-8 space-y-5"
          >

            <div>

              <label className="mb-2 block text-[12px] font-bold">
                Financial Year
              </label>

              <select
                value={financialYear}
                onChange={(e) =>
                  setFinancialYear(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-[13px]"
              >
                <option value="2024-25">
                  2024-25
                </option>

                <option value="2025-26">
                  2025-26
                </option>

              </select>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#27332f] bg-[#0b1110] px-6 py-12 text-center transition hover:border-[#19b985]">

              <UploadCloud
                size={42}
                className="text-[#c9933a]"
              />

              <p className="mt-4 text-[14px] font-extrabold">
                Click to choose salary slip
              </p>

              <p className="mt-1 text-[12px] text-[#7f8b85]">
                PDF, JPG, JPEG or PNG
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  setFile(
                    e.target.files[0]
                  );
                }}
                className="hidden"
              />
            </label>

            {file && (
              <div className="flex items-center gap-3 rounded-xl border border-[#27332f] bg-[#0b1110] p-4">

                <FileText
                  size={20}
                  className="text-[#19b985]"
                />

                <p className="text-[13px] font-bold">
                  {file.name}
                </p>

              </div>
            )}

            <button
              type="submit" 
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] py-4 text-[13px] font-extrabold text-[#07100d]"
            >
              {loading
                ? "Processing OCR..."
                : "Upload & Continue"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}