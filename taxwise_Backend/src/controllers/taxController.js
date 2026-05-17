import SalaryRecord from "../models/SalaryRecord.js";
import UserProfile from "../models/UserProfile.js";
import TaxCalculation from "../models/TaxCalculation.js";

const calculateHraExemption = ({ annualHra, annualBasic, annualRent, cityType }) => {
  if (!annualRent || annualRent <= 0) return 0;

  const formula1 = annualHra;

  const formula2 =
    cityType === "metro"
      ? annualBasic * 0.5
      : annualBasic * 0.4;

  const formula3 = annualRent - annualBasic * 0.1;

  return Math.max(0, Math.min(formula1, formula2, formula3));
};

const calculateOldRegimeTax = (income) => {
  let tax = 0;

  if (income > 250000) {
    tax += (Math.min(income, 500000) - 250000) * 0.05;
  }

  if (income > 500000) {
    tax += (Math.min(income, 1000000) - 500000) * 0.2;
  }

  if (income > 1000000) {
    tax += (income - 1000000) * 0.3;
  }

  return Math.max(0, Math.round(tax * 1.04));
};

const calculateNewRegimeTax = (income) => {
  let tax = 0;

  if (income > 300000) {
    tax += (Math.min(income, 700000) - 300000) * 0.05;
  }

  if (income > 700000) {
    tax += (Math.min(income, 1000000) - 700000) * 0.1;
  }

  if (income > 1000000) {
    tax += (Math.min(income, 1200000) - 1000000) * 0.15;
  }

  if (income > 1200000) {
    tax += (Math.min(income, 1500000) - 1200000) * 0.2;
  }

  if (income > 1500000) {
    tax += (income - 1500000) * 0.3;
  }

  return Math.max(0, Math.round(tax * 1.04));
};

export const calculateTax = async (req, res) => {
  try {
    const userId = req.user.id;

    const salary = await SalaryRecord.findOne({
      userId,
      isActive: true,
    }).sort({ createdAt: -1 });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "No active salary record found. Please upload salary slip first.",
      });
    }

    const profile = await UserProfile.findOne({
      userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please complete profile setup first.",
      });
    }

    const annualBasic = Number(salary.basicSalary || 0) * 12;
    const annualHra = Number(salary.hra || 0) * 12;
    const grossAnnualSalary = Number(salary.grossSalary || 0) * 12;
    const annualRent = Number(profile.rentPaid || 0) * 12;

    const hraExemption = calculateHraExemption({
      annualHra,
      annualBasic,
      annualRent,
      cityType: profile.cityType,
    });

    const standardDeductionOld = 50000;
    const standardDeductionNew = 75000;

    const deduction80C = Math.min(Number(profile.existing80C || 0), 150000);
    const deduction80D = Math.min(Number(profile.existing80D || 0), 25000);
    const deductionNPS = Math.min(Number(profile.existingNPS || 0), 50000);
    const deduction24 = profile.hasHomeLoan
      ? Math.min(Number(profile.homeLoanInterest || 0), 200000)
      : 0;
    const deduction80E = profile.hasEducationLoan
      ? Number(profile.educationLoanInterest || 0)
      : 0;
    const deduction80G = Number(profile.existing80G || 0);

    const totalOldDeductions =
      standardDeductionOld +
      hraExemption +
      deduction80C +
      deduction80D +
      deductionNPS +
      deduction24 +
      deduction80E +
      deduction80G;

    const taxableIncomeOld = Math.max(0, grossAnnualSalary - totalOldDeductions);
    const taxableIncomeNew = Math.max(0, grossAnnualSalary - standardDeductionNew);

    const taxOldRegime = calculateOldRegimeTax(taxableIncomeOld);
    const taxNewRegime = calculateNewRegimeTax(taxableIncomeNew);

    const gap80C = Math.max(0, 150000 - Number(profile.existing80C || 0));
    const gap80D = Math.max(0, 25000 - Number(profile.existing80D || 0));
    const gapNPS = Math.max(0, 50000 - Number(profile.existingNPS || 0));

    const oldTaxWithoutGaps = calculateOldRegimeTax(
      Math.max(
        0,
        grossAnnualSalary -
          (standardDeductionOld + hraExemption + deduction24 + deduction80E + deduction80G)
      )
    );

    const potentialSaving = Math.max(0, oldTaxWithoutGaps - taxOldRegime);

    let betterRegime = "same";

    if (taxOldRegime < taxNewRegime) {
      betterRegime = "old";
    } else if (taxNewRegime < taxOldRegime) {
      betterRegime = "new";
    }

    const result = {
      financialYear: salary.financialYear,
      grossAnnualSalary,
      hraExemption,
      totalOldDeductions,
      taxableIncomeOld,
      taxableIncomeNew,
      taxOldRegime,
      taxNewRegime,
      gap80C,
      gap80D,
      gapNPS,
      potentialSaving,
      betterRegime,
    };

    const taxCalculation = await TaxCalculation.create({
      userId,
      salaryRecordId: salary._id,
      financialYear: salary.financialYear,
      hraExemption,
      taxOldRegime,
      taxNewRegime,
      taxableIncomeOld,
      taxableIncomeNew,
      gap80C,
      gap80D,
      gapNPS,
      potentialSaving,
      betterRegime,
      rawResult: result,
    });

    return res.status(200).json({
      success: true,
      message: "Tax calculated successfully",
      calculation: taxCalculation,
      result,
    });
  } catch (error) {
    console.log("TAX CALCULATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Tax calculation failed",
      error: error.message,
    });
  }
};