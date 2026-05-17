// const cleanNumber = (value = "") => {
//   const number = value.replace(/[₹,\s]/g, "").match(/\d+(\.\d+)?/);
//   return number ? Number(number[0]) : 0;
// };

// const findAmountNearKeyword = (text, keywords) => {
//   const lines = text
//     .split("\n")
//     .map((line) => line.trim())
//     .filter(Boolean);

//   for (const line of lines) {
//     const lower = line.toLowerCase();

//     const matched = keywords.some((keyword) =>
//       lower.includes(keyword.toLowerCase())
//     );

//     if (matched) {
//       return cleanNumber(line);
//     }
//   }

//   return 0;
// };

// export const parseSalarySlipText = (blocks = []) => {
//   const lines = blocks
//     .filter((block) => block.BlockType === "LINE")
//     .map((block) => block.Text || "");

//   const fullText = lines.join("\n");

//   const basicSalary = findAmountNearKeyword(fullText, [
//     "basic",
//     "basic pay",
//     "basic salary",
//   ]);

//   const hra = findAmountNearKeyword(fullText, [
//     "hra",
//     "house rent",
//     "house rent allowance",
//   ]);

//   const specialAllowance = findAmountNearKeyword(fullText, [
//     "special allowance",
//     "special",
//   ]);

//   const bonus = findAmountNearKeyword(fullText, [
//     "bonus",
//     "incentive",
//   ]);

//   const employerPF = findAmountNearKeyword(fullText, [
//     "employer pf",
//     "epf",
//     "provident fund",
//     "pf",
//   ]);

//   const companyInsurance = findAmountNearKeyword(fullText, [
//     "group insurance",
//     "insurance",
//   ]);

//   const grossSalary = findAmountNearKeyword(fullText, [
//     "gross salary",
//     "gross pay",
//     "gross earnings",
//     "total earnings",
//   ]);

//   const confidenceValues = blocks
//     .filter((block) => block.BlockType === "LINE" && block.Confidence)
//     .map((block) => block.Confidence);

//   const ocrConfidence =
//     confidenceValues.length > 0
//       ? Math.round(
//           confidenceValues.reduce((sum, val) => sum + val, 0) /
//             confidenceValues.length
//         )
//       : 0;

//   return {
//     basicSalary,
//     hra,
//     specialAllowance,
//     bonus,
//     employerPF,
//     companyInsurance,
//     grossSalary,
//     ocrConfidence,
//     rawText: fullText,
//   };
// };

const cleanNumber = (value = "") => {

  const number =
    value
      .replace(/[₹,\s]/g, "")
      .match(/\d+(\.\d+)?/);

  return number
    ? Number(number[0])
    : 0;
};

const findAmountNearKeyword = (
  text,
  keywords
) => {

  const lines =
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  for (const line of lines) {

    const lower =
      line.toLowerCase();

    const matched =
      keywords.some((keyword) =>
        lower.includes(
          keyword.toLowerCase()
        )
      );

    if (matched) {
      return cleanNumber(line);
    }
  }

  return 0;
};

export const parseSalarySlipTextFromText =
  (text = "") => {

    const basicSalary =
      findAmountNearKeyword(
        text,
        [
          "basic",
          "basic pay",
          "basic salary",
        ]
      );

    const hra =
      findAmountNearKeyword(
        text,
        [
          "hra",
          "house rent",
        ]
      );

    const specialAllowance =
      findAmountNearKeyword(
        text,
        [
          "special allowance",
          "special",
        ]
      );

    const bonus =
      findAmountNearKeyword(
        text,
        [
          "bonus",
          "incentive",
        ]
      );

    const employerPF =
      findAmountNearKeyword(
        text,
        [
          "pf",
          "epf",
          "provident fund",
        ]
      );

    const companyInsurance =
      findAmountNearKeyword(
        text,
        [
          "insurance",
          "group insurance",
        ]
      );

    const grossSalary =
      findAmountNearKeyword(
        text,
        [
          "gross salary",
          "gross pay",
          "total earnings",
        ]
      );

    return {
      basicSalary,
      hra,
      specialAllowance,
      bonus,
      employerPF,
      companyInsurance,
      grossSalary,
      ocrConfidence: 85,
    };
};