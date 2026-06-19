import SalaryRecord from "../models/SalaryRecord.js";
import UserProfile from "../models/UserProfile.js";
import TaxCalculation from "../models/TaxCalculation.js";
import axios from "axios";
import MLSuggestion from "../models/MLSuggestion.js";

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

    const taxableIncomeOld = Math.max(
      0,
      grossAnnualSalary - totalOldDeductions
    );

    const taxableIncomeNew = Math.max(
      0,
      grossAnnualSalary - standardDeductionNew
    );

    const taxOldRegime = calculateOldRegimeTax(taxableIncomeOld);
    const taxNewRegime = calculateNewRegimeTax(taxableIncomeNew);

    const gap80C = Math.max(0, 150000 - Number(profile.existing80C || 0));
    const gap80D = Math.max(0, 25000 - Number(profile.existing80D || 0));
    const gapNPS = Math.max(0, 50000 - Number(profile.existingNPS || 0));

    const oldTaxWithoutGaps = calculateOldRegimeTax(
      Math.max(
        0,
        grossAnnualSalary -
          (
            standardDeductionOld +
            hraExemption +
            deduction24 +
            deduction80E +
            deduction80G
          )
      )
    );

    const potentialSaving = Math.max(
      0,
      oldTaxWithoutGaps - taxOldRegime
    );

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

    let mlSuggestion = null;

    try {
      const mlPayload = {
        salary: grossAnnualSalary,
        age: Number(profile.age || 0),
        city_type: profile.cityType === "metro" ? 1 : 0,

        risk_appetite:
          profile.riskAppetite === "high"
            ? 3
            : profile.riskAppetite === "medium"
            ? 2
            : 1,

        years_to_retirement: Number(profile.yearsToRetirement || 0),

        basic_salary: annualBasic,
        hra_received: annualHra,
        special_allowance: Number(salary.specialAllowance || 0) * 12,
        bonus: Number(salary.bonus || 0) * 12,
        employer_pf: Number(salary.employerPF || 0) * 12,

        is_rented: Number(profile.rentPaid || 0) > 0 ? 1 : 0,
        rent_paid: annualRent,

        existing_80C: Number(profile.existing80C || 0),
        existing_80D: Number(profile.existing80D || 0),
        existing_NPS: Number(profile.existingNPS || 0),
        existing_80G: Number(profile.existing80G || 0),

        has_home_loan: profile.hasHomeLoan ? 1 : 0,
        home_loan_interest: Number(profile.homeLoanInterest || 0),

        has_education_loan: profile.hasEducationLoan ? 1 : 0,
        education_loan_interest: Number(profile.educationLoanInterest || 0),

        parent_senior: profile.lifeEvents?.some(
          (item) => item.event === "parent_senior_citizen"
        )
          ? 1
          : 0,

        has_girl_child: profile.lifeEvents?.some(
          (item) => item.event === "child_birth"
        )
          ? 1
          : 0,

        gap_80C: gap80C,
        gap_80D: gap80D,
        gap_NPS: gapNPS,
      };

      const mlResponse = await axios.post(
        `${ML_SERVICE_URL}`,
        mlPayload
      );

      const prediction = mlResponse.data.prediction;

              const marginalRate =
          taxableIncomeOld > 1500000
            ? 0.3
            : taxableIncomeOld > 1000000
            ? 0.2
            : taxableIncomeOld > 500000
            ? 0.1
            : 0.05;

        const saving80C = prediction.suggest_80C_topup
          ? Math.round(gap80C * marginalRate)
          : 0;

        const saving80D = prediction.suggest_80D
          ? Math.round(gap80D * marginalRate)
          : 0;

        const savingNPS = prediction.suggest_NPS
          ? Math.round(gapNPS * marginalRate)
          : 0;

        const priorityItems = [
          {
            key: "80C",
            saving: saving80C,
          },
          {
            key: "80D",
            saving: saving80D,
          },
          {
            key: "NPS",
            saving: savingNPS,
          },
        ].filter((item) => item.saving > 0);

        priorityItems.sort((a, b) => b.saving - a.saving);

        const priorityOrder = priorityItems.map((item) => item.key);

        mlSuggestion = await MLSuggestion.create({
        userId,
        calculationId: taxCalculation._id,

        suggest80C: Boolean(prediction.suggest_80C_topup),
        suggest80D: Boolean(prediction.suggest_80D),
        suggestNPS: Boolean(prediction.suggest_NPS),


        saving80C,
        saving80D,
        savingNPS,

        best80CInstrument: prediction.best_80C_instrument,
        regimeRecommendation: prediction.recommended_regime,

        confidenceScore: 0.85,
        priorityOrder,
      });

      taxCalculation.mlSuggestionId = mlSuggestion._id;
      await taxCalculation.save();
    } catch (mlError) {
      console.log("ML SERVICE ERROR:", mlError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Tax calculated successfully",
      calculation: taxCalculation,
      result,
      mlSuggestion,
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

export const getLatestTaxCalculation = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeSalary = await SalaryRecord.findOne({
      userId,
      isActive: true,
    }).sort({ createdAt: -1 });

    if (!activeSalary) {
      return res.status(200).json({
        success: true,
        hasActiveSalary: false,
        hasCalculation: false,
        result: null,
      });
    }

    const calculation = await TaxCalculation.findOne({
      userId,
      salaryRecordId: activeSalary._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      hasActiveSalary: true,
      hasCalculation: !!calculation,
      activeSalaryId: activeSalary._id,
      result: calculation?.rawResult || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest tax calculation",
      error: error.message,
    });
  }
};