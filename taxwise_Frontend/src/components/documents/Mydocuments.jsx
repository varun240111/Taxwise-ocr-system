import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  UploadCloud,
  FolderOpen,
  FileText,
  Trash2,
  ExternalLink,
} from "lucide-react";

const documentTypes = [
  { value: "80C", label: "80C Investment Proof" },
  { value: "80D", label: "80D Health Insurance" },
  { value: "NPS", label: "NPS Proof" },
  { value: "RENT_RECEIPT", label: "Rent Receipt" },
  { value: "HOME_LOAN", label: "Home Loan Proof" },
  { value: "EDUCATION_LOAN", label: "Education Loan Proof" },
  { value: "DONATION", label: "Donation Proof" },
  { value: "OTHER", label: "Other Document" },
];

export default function Mydocuments() {
  const [documents, setDocuments] = useState([]);
  const [documentType, setDocumentType] = useState("80C");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data.documents || []);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a document");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", documentType);
      formData.append("title", title || file.name);

      await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setFile(null);
      await fetchDocuments();

      alert("Document uploaded successfully");
    } catch {
      alert("Document upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm("Delete this document?");
    if (!ok) return;

    try {
      await api.delete(`/documents/${id}`);
      await fetchDocuments();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <section className="min-h-[calc(100vh-112px)] p-6 text-[#e8f0ec]">
      <div className="rounded-3xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#19b98520] bg-[#19b98514] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#19b985]">
          <FolderOpen size={14} />
          Document Vault
        </p>

        <h1 className="mt-5 text-4xl font-black">
          Upload Investment Proofs
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f8b85]">
          Store 80C, 80D, NPS, rent receipt, loan and donation proofs securely in AWS S3.
        </p>

        <form
          onSubmit={handleUpload}
          className="mt-8 rounded-3xl border border-[#27332f] bg-[#111917] p-6"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm outline-none"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
                Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="LIC receipt, rent proof..."
                className="mt-2 w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7f8b85]">
                File
              </label>

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="mt-2 w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="mt-6 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] px-6 py-3 text-sm font-extrabold text-[#07100d] disabled:opacity-60"
          >
            <UploadCloud size={18} />
            {uploading ? "Uploading..." : "Upload Proof"}
          </button>
        </form>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-[#7f8b85]">Loading documents...</p>
          ) : documents.length === 0 ? (
            <div className="rounded-3xl border border-[#27332f] bg-[#111917] p-6">
              <h3 className="text-xl font-black">No Documents Yet</h3>
              <p className="mt-2 text-sm text-[#7f8b85]">
                Upload your first investment proof.
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc._id}
                className="rounded-3xl border border-[#27332f] bg-[#111917] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19b98518] text-[#19b985]">
                    <FileText size={22} />
                  </div>

                  <span className="rounded-full bg-[#c9933a22] px-3 py-1 text-[10px] font-black text-[#c9933a]">
                    {doc.documentType}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black">{doc.title}</h3>

                <p className="mt-2 text-sm text-[#7f8b85]">
                  {doc.fileName}
                </p>

                <p className="mt-1 text-xs text-[#4f5d57]">
                  Uploaded: {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                </p>

                <div className="mt-5 flex gap-3">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-sm font-bold text-[#e8f0ec]"
                  >
                    <ExternalLink size={16} />
                    Open
                  </a>

                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}