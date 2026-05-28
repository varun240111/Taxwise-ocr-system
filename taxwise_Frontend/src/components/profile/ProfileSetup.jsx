import { useEffect, useState } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";

export default function ProfileSetup({
  setProfileCompleted,
  setActivePage,
  redirectAfterSetup,
}) {
  const token = useSelector((state) => state.auth.token);

  const [originalData, setOriginalData] = useState({});

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    city: "",
    cityType: "metro",
    riskAppetite: "medium",
    lifeEvents: [],
  });

  const lifeEventOptions = [
    "married",
    "child_birth",
    "home_loan",
    "job_change",
    "parent_senior_citizen",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = res.data.profile;

        setFormData({
          fullName: profile.fullName || "",
          age: profile.age || "",
          city: profile.city || "",
          cityType: profile.cityType || "metro",
          riskAppetite: profile.riskAppetite || "medium",
          lifeEvents:
            profile.lifeEvents?.map((item) => {

                // old DB format
                if (typeof item === "string") {
                return item;
                }

                // new DB format
                if (item?.event) {
                return item.event;
                }

                return null;

            }).filter(Boolean) || [],
            });
        setIsEditMode(true);
        setOriginalData({
        fullName: profile.fullName || "",
        age: profile.age || "",
        city: profile.city || "",
        cityType: profile.cityType || "metro",
        riskAppetite: profile.riskAppetite || "medium",
        lifeEvents:
          profile.lifeEvents?.map((item) => {
            if (typeof item === "string") return item;

            if (item?.event) return item.event;

            return null;
          }).filter(Boolean) || [],
      });
      } catch (error) {
        setIsEditMode(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleLifeEvent = (event) => {
    setFormData((prev) => ({
      ...prev,
      lifeEvents: prev.lifeEvents.includes(event)
        ? prev.lifeEvents.filter((e) => e !== event)
        : [...prev.lifeEvents, event],
    }));
  };

      const handleSubmit = async (e) => {
      e.preventDefault();

      try {

        // CREATE MODE
        if (!isEditMode) {

          const payload = {
            ...formData,
            lifeEvents: formData.lifeEvents.map((event) => ({
              event,
              date: new Date(),
            })),
          };
          
          await api.post("/profile/setup", payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          alert("Profile completed successfully");
        }

        // UPDATE MODE
        else {

          const updatedFields = {};

          Object.keys(formData).forEach((key) => {

            const currentValue =
              JSON.stringify(formData[key]);

            const originalValue =
              JSON.stringify(originalData[key]);

            if (currentValue !== originalValue) {

              if (key === "lifeEvents") {

                updatedFields[key] =
                  formData.lifeEvents.map((event) => ({
                    event,
                    date: new Date(),
                  }));

              } else {

                updatedFields[key] = formData[key];
              }
            }
          });

          // nothing changed
          if (Object.keys(updatedFields).length === 0) {
            alert("No changes detected");
            return;
          }

          await api.put("/profile/update", updatedFields, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          alert("Profile updated successfully");
        }

        setProfileCompleted?.(true);

        if (redirectAfterSetup === "upload") {
          setActivePage?.("upload");
        } else {
          setActivePage?.("dashboard");
        }

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Profile save failed"
        );
      }
    };

  if (loading) {
    return (
      <section className="text-[#e8f0ec]">
        <div className="rounded-2xl border border-[#27332f] bg-[#111917] p-8">
          Loading profile...
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-112px)] text-[#e8f0ec]">
      <div className="rounded-2xl border border-[#1e2c27] bg-[#0b1110] p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#27332f] bg-[#111917] p-8">
          <div className="mb-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#c9933a]">
              {isEditMode ? "Update Profile" : "Profile Setup"}
            </p>

            <h1 className="mt-3 text-[34px] font-extrabold tracking-[-0.5px]">
              {isEditMode ? "Update Your Tax Profile" : "Complete Your Tax Profile"}
            </h1>

            <p className="mt-3 text-[13px] leading-6 text-[#7f8b85]">
              Your profile helps TaxWise calculate tax accurately and personalize ML suggestions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
            <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />

            <Select
              label="City Type"
              name="cityType"
              value={formData.cityType}
              onChange={handleChange}
              options={[
                { value: "metro", label: "Metro" },
                { value: "non-metro", label: "Non Metro" },
              ]}
            />

            <Select
              label="Risk Appetite"
              name="riskAppetite"
              value={formData.riskAppetite}
              onChange={handleChange}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />

            <div className="md:col-span-2">
              <label className="mb-3 block text-[12px] font-bold">
                Life Events
              </label>

              <div className="flex flex-wrap gap-3">
                {lifeEventOptions.map((event) => (
                  <button
                    type="button"
                    key={event}
                    onClick={() => toggleLifeEvent(event)}
                    className={`rounded-full border px-4 py-2 text-[12px] font-bold transition ${
                      formData.lifeEvents.includes(event)
                        ? "border-[#19b985] bg-[#19b98520] text-[#19b985]"
                        : "border-[#27332f] bg-[#0b1110] text-[#7f8b85]"
                    }`}
                  >
                    {event.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#c9933a] to-[#19b985] py-4 text-[13px] font-extrabold text-[#07100d]"
              >
                {isEditMode ? "Update Profile" : "Complete Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-bold">{label}</label>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-[13px] outline-none"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-bold">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#27332f] bg-[#0b1110] px-4 py-3 text-[13px] outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}