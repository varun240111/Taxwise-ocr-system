export default function MoreTaxDetails({
  formData,
  handleChange,
}) {

  return (
     <div className="mt-8 rounded-3xl border border-[#27332f] bg-gradient-to-b from-[#111917] to-[#0b1110] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

      <h2 className="text-2xl font-extrabold">
        More Tax Information
      </h2>

     <div className="mt-6 grid gap-6 md:grid-cols-2">

        <Input
          label="Monthly Rent Paid"
          name="rentPaid"
          value={formData.rentPaid}
          onChange={handleChange}
        />

        <Input
          label="City of Residence"
          name="cityOfResidence"
          value={formData.cityOfResidence}
          onChange={handleChange}
        />

        <Input
          label="Landlord Name"
          name="landlordName"
          value={formData.landlordName}
          onChange={handleChange}
        />

        <Input
          label="Existing 80C"
          name="existing80C"
          value={formData.existing80C}
          onChange={handleChange}
        />

        <Input
          label="Health Insurance (80D)"
          name="existing80D"
          value={formData.existing80D}
          onChange={handleChange}
        />

        <Input
          label="NPS Contribution"
          name="existingNPS"
          value={formData.existingNPS}
          onChange={handleChange}
        />

        <Input
          label="Donations (80G)"
          name="existing80G"
          value={formData.existing80G}
          onChange={handleChange}
        />

      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#27332f] bg-[#111917] px-4 py-3 text-sm"
      />
    </div>
  );
}