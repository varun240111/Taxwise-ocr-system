import PDFDocument from "pdfkit";

export const generateTaxReport = async (req, res) => {
  try {
    const { profile, salary, tax, suggestion } = req.body;

    if (!profile || !salary || !tax) {
      return res.status(400).json({
        success: false,
        message: "Report data missing",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 45,
      bufferPages: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=TaxWise-HR-Declaration-Report.pdf"
    );

    doc.pipe(res);

    const primary = "#111827";
    const secondary = "#6b7280";
    const accent = "#0f766e";
    const gold = "#c9933a";
    const page = "#f8fafc";
    const white = "#ffffff";
    const soft = "#f3f4f6";
    const border = "#d1d5db";

    const reportYear = new Date().getFullYear();

    const annualBasic = Number(salary.basicSalary || 0) * 12;
    const annualHra = Number(salary.hra || 0) * 12;
    const annualSpecial = Number(salary.specialAllowance || 0) * 12;
    const annualBonus = Number(salary.bonus || 0) * 12;
    const annualPF = Number(salary.employerPF || salary.pf || 0) * 12;

    const totalSaving =
      Number(suggestion?.saving80C || 0) +
      Number(suggestion?.saving80D || 0) +
      Number(suggestion?.savingNPS || 0);

    const betterRegime =
      tax.betterRegime === "old"
        ? "Old Regime"
        : tax.betterRegime === "new"
        ? "New Regime"
        : suggestion?.regimeRecommendation || "Same";

    drawPageBackground(doc, page, border);
    drawHeader(doc, {
      primary,
      secondary,
      accent,
      border,
      white,
      reportYear,
    });

    // Employee Card
    roundedCard(doc, 45, 120, 505, 105, white, border);

    doc
      .fillColor(primary)
      .font("Helvetica-Bold")
      .fontSize(23)
      .text(value(profile.fullName), 75, 145, { width: 280 });

    doc
      .fillColor(secondary)
      .font("Helvetica")
      .fontSize(11)
      .text(
        `${value(profile.city)}  •  ${value(profile.cityType)}  •  ${value(
          profile.riskAppetite
        )} risk`,
        75,
        177,
        { width: 300 }
      );

    pill(doc, 75, 198, `Age ${value(profile.age)}`, accent);

    doc
      .fillColor(secondary)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("EMPLOYMENT TYPE", 395, 150, {
        width: 120,
        align: "right",
      });

    doc
      .fillColor(gold)
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(value(profile.employmentType || "Salaried"), 395, 168, {
        width: 120,
        align: "right",
      });

    doc
      .fillColor(secondary)
      .font("Helvetica")
      .fontSize(9)
      .text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 395, 190, {
        width: 120,
        align: "right",
      });

    // Salary Summary
    sectionTitle(doc, "01", "Salary Summary", 260, accent, primary);

    metric(doc, 45, 295, "Gross Annual Salary", rupee(tax.grossAnnualSalary), "Total annual salary");
    metric(doc, 175, 295, "Basic Salary", rupee(annualBasic), "Annual basic");
    metric(doc, 305, 295, "HRA Component", rupee(annualHra), "Annual HRA");
    metric(doc, 435, 295, "HRA Exemption", rupee(tax.hraExemption), "Tax exempt");

    tableHeader(doc, 45, 410, ["Component", "Annual Amount", "Tax Treatment"], soft, primary);

    tableRow(doc, 45, 445, ["Basic Salary", rupee(annualBasic), "Taxable"]);
    tableRow(doc, 45, 480, ["HRA Allowance", rupee(annualHra), "Partially Exempt"]);
    tableRow(doc, 45, 515, ["Special Allowance", rupee(annualSpecial), "Taxable"]);
    tableRow(doc, 45, 550, ["Annual Bonus", rupee(annualBonus), "Taxable"]);
    tableRow(doc, 45, 585, ["Employer PF", rupee(annualPF), "Retirement Benefit"]);

    // Tax Regime
    sectionTitle(doc, "02", "Tax Regime Comparison", 645, accent, primary);

    regimeCard(
      doc,
      45,
      680,
      240,
      "Old Regime",
      tax.taxOldRegime,
      tax.taxableIncomeOld,
      betterRegime.toLowerCase().includes("old"),
      accent,
      primary,
      secondary,
      border
    );

    regimeCard(
      doc,
      310,
      680,
      240,
      "New Regime",
      tax.taxNewRegime,
      tax.taxableIncomeNew,
      betterRegime.toLowerCase().includes("new"),
      accent,
      primary,
      secondary,
      border
    );

    // Page 2
    doc.addPage();
    drawPageBackground(doc, page, border);
    drawHeader(doc, {
      primary,
      secondary,
      accent,
      border,
      white,
      reportYear,
      small: true,
    });

    sectionTitle(doc, "03", "Deduction Gap Analysis", 115, accent, primary);

    gapCard(doc, 45, 150, 155, "80C Gap", tax.gap80C, 150000, accent, primary, secondary, border);
    gapCard(doc, 220, 150, 155, "80D Gap", tax.gap80D, 25000, gold, primary, secondary, border);
    gapCard(doc, 395, 150, 155, "NPS Gap", tax.gapNPS, 50000, "#2563eb", primary, secondary, border);

    sectionTitle(doc, "04", "ML Tax Saving Suggestions", 300, accent, primary);

    const suggestionRows = [];

    if (suggestion?.suggest80C) {
      suggestionRows.push([
        "80C Investment",
        suggestion.best80CInstrument || "ELSS / PPF",
        rupee(suggestion.saving80C),
      ]);
    }

    if (suggestion?.suggest80D) {
      suggestionRows.push([
        "Health Insurance",
        "Section 80D",
        rupee(suggestion.saving80D),
      ]);
    }

    if (suggestion?.suggestNPS) {
      suggestionRows.push([
        "NPS Contribution",
        "80CCD(1B)",
        rupee(suggestion.savingNPS),
      ]);
    }

    tableHeader(doc, 45, 335, ["Suggestion", "Category", "Estimated Saving"], soft, primary);

    let y = 370;

    if (suggestionRows.length === 0) {
      tableRow(doc, 45, y, ["No active suggestion", "Balanced", rupee(0)]);
      y += 40;
    } else {
      suggestionRows.forEach((row) => {
        tableRow(doc, 45, y, row);
        y += 35;
      });
    }

    roundedCard(doc, 45, y + 25, 505, 85, white, border);

    doc
      .fillColor(secondary)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("TOTAL ESTIMATED ADDITIONAL SAVING", 70, y + 48);

    doc
      .fillColor(accent)
      .font("Helvetica-Bold")
      .fontSize(26)
      .text(rupee(totalSaving), 70, y + 68);

    doc
      .fillColor(secondary)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("RECOMMENDED REGIME", 355, y + 50, {
        width: 150,
        align: "right",
      });

    doc
      .fillColor(gold)
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(betterRegime, 355, y + 68, {
        width: 150,
        align: "right",
      });

    y += 145;

    sectionTitle(doc, "05", "Action Priority Order", y, accent, primary);
    y += 35;

    if (suggestion?.priorityOrder?.length) {
      suggestion.priorityOrder.forEach((item, index) => {
        priorityRow(doc, 45, y, index + 1, item, accent, primary, secondary, border);
        y += 32;
      });
    } else {
      priorityRow(doc, 45, y, 1, "No priority actions required", accent, primary, secondary, border);
      y += 32;
    }

    y += 20;

    sectionTitle(doc, "06", "HR Proof Checklist", y, accent, primary);
    y += 35;

    const checklist = [
      "Salary slip / salary receipt",
      "80C investment proof",
      "Health insurance premium receipt",
      "NPS contribution proof",
      "Rent receipt / landlord details, if HRA claimed",
    ];

    checklist.forEach((item) => {
      checklistRow(doc, 45, y, item, accent, primary, border);
      y += 28;
    });

    addFooters(doc, secondary, border);

    doc.end();
  } catch (error) {
    console.log("REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
};

function drawPageBackground(doc, page, border) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(page);

  doc
    .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .strokeColor(border)
    .lineWidth(1)
    .stroke();
}

function drawHeader(doc, { primary, secondary, accent, border, white, reportYear, small }) {
  doc.rect(20, 20, doc.page.width - 40, small ? 62 : 72).fill(white);

  doc
    .moveTo(20, small ? 82 : 92)
    .lineTo(doc.page.width - 20, small ? 82 : 92)
    .strokeColor(border)
    .lineWidth(1)
    .stroke();

  doc
    .fillColor(primary)
    .font("Helvetica-Bold")
    .fontSize(small ? 20 : 26)
    .text("TaxWise Vault", 45, small ? 36 : 34);

  doc
    .fillColor(secondary)
    .font("Helvetica")
    .fontSize(11)
    .text("HR Tax Declaration Report", 47, small ? 60 : 64);

  doc
    .fillColor(accent)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(String(reportYear), 455, small ? 47 : 48, {
      width: 80,
      align: "right",
    });
}

function sectionTitle(doc, number, title, y, accent, primary) {
  doc
    .fillColor(accent)
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(number, 45, y);

  doc
    .fillColor(primary)
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(title, 78, y - 2);
}

function roundedCard(doc, x, y, w, h, fill = "#ffffff", stroke = "#d1d5db") {
  doc.roundedRect(x, y, w, h, 14).fillAndStroke(fill, stroke);
}

function pill(doc, x, y, text, accent) {
  doc.roundedRect(x, y, 92, 22, 11).fill("#ecfdf5");

  doc
    .fillColor(accent)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(text, x + 14, y + 7);
}

function metric(doc, x, y, title, value, subtitle) {
  doc.roundedRect(x, y, 112, 84, 14).fillAndStroke("#ffffff", "#d1d5db");

  doc
    .fillColor("#6b7280")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(title.toUpperCase(), x + 14, y + 16, { width: 84 });

  doc
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(value, x + 14, y + 40, { width: 86 });

  doc
    .fillColor("#6b7280")
    .font("Helvetica")
    .fontSize(8)
    .text(subtitle, x + 14, y + 64, { width: 86 });
}

function tableHeader(doc, x, y, headers, soft, primary) {
  doc.roundedRect(x, y, 505, 30, 8).fill(soft);

  headers.forEach((h, i) => {
    doc
      .fillColor(primary)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(h, x + 18 + i * 165, y + 10, {
        width: 145,
      });
  });
}

function tableRow(doc, x, y, values) {
  doc.roundedRect(x, y, 505, 32, 8).fillAndStroke("#ffffff", "#e5e7eb");

  values.forEach((v, i) => {
    doc
      .fillColor("#374151")
      .font(i === 1 || i === 2 ? "Helvetica-Bold" : "Helvetica")
      .fontSize(10)
      .text(v || "N/A", x + 18 + i * 165, y + 10, {
        width: 145,
      });
  });
}

function regimeCard(
  doc,
  x,
  y,
  w,
  title,
  tax,
  income,
  active,
  accent,
  primary,
  secondary,
  border
) {
  doc
    .roundedRect(x, y, w, 105, 15)
    .fillAndStroke(active ? "#ecfdf5" : "#ffffff", active ? accent : border);

  doc
    .fillColor(secondary)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(title.toUpperCase(), x + 18, y + 20);

  if (active) {
    doc.roundedRect(x + w - 108, y + 16, 88, 20, 10).fill("#d1fae5");

    doc
      .fillColor(accent)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("RECOMMENDED", x + w - 98, y + 22);
  }

  doc
    .fillColor(active ? accent : primary)
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(rupee(tax), x + 18, y + 50);

  doc
    .fillColor(secondary)
    .font("Helvetica")
    .fontSize(9)
    .text(`Taxable Income: ${rupee(income)}`, x + 18, y + 82);
}

function gapCard(doc, x, y, w, label, gap, limit, color, primary, secondary, border) {
  const used = Math.max(0, Number(limit || 0) - Number(gap || 0));
  const pct = limit > 0 ? Math.min(1, used / limit) : 0;

  doc.roundedRect(x, y, w, 105, 14).fillAndStroke("#ffffff", border);

  doc
    .fillColor(primary)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(label.toUpperCase(), x + 14, y + 18);

  doc
    .fillColor(color)
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(rupee(gap), x + 14, y + 42);

  doc
    .fillColor(secondary)
    .font("Helvetica")
    .fontSize(8)
    .text(`Limit: ${rupee(limit)}`, x + 14, y + 64);

  doc.roundedRect(x + 14, y + 82, w - 28, 6, 3).fill("#e5e7eb");
  doc.roundedRect(x + 14, y + 82, (w - 28) * pct, 6, 3).fill(color);
}

function priorityRow(doc, x, y, number, text, accent, primary, secondary, border) {
  doc.roundedRect(x, y, 505, 24, 8).fillAndStroke("#ffffff", border);

  doc.roundedRect(x + 12, y + 5, 22, 14, 7).fill("#ecfdf5");

  doc
    .fillColor(accent)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(String(number), x + 20, y + 9);

  doc
    .fillColor(primary)
    .font("Helvetica")
    .fontSize(10)
    .text(text, x + 45, y + 7);

  doc
    .fillColor(secondary)
    .fontSize(8)
    .text("Priority action", x + 405, y + 8);
}

function checklistRow(doc, x, y, text, accent, primary, border) {
  doc.roundedRect(x, y, 505, 24, 8).fillAndStroke("#ffffff", border);

  doc
    .fillColor(accent)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("✓", x + 14, y + 7);

  doc
    .fillColor(primary)
    .font("Helvetica")
    .fontSize(9.5)
    .text(text, x + 38, y + 7);
}

function addFooters(doc, secondary, border) {
  const pages = doc.bufferedPageRange();

  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    doc
      .moveTo(45, 790)
      .lineTo(550, 790)
      .strokeColor(border)
      .lineWidth(1)
      .stroke();

    doc
      .fillColor(secondary)
      .font("Helvetica")
      .fontSize(8)
      .text(
        "Generated by TaxWise Vault • Confidential HR Declaration Report",
        50,
        804
      );

    doc
      .fillColor(secondary)
      .fontSize(8)
      .text(`Page ${i + 1} of ${pages.count}`, 495, 804);
  }
}

function rupee(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function value(v) {
  return v === undefined || v === null || v === "" ? "N/A" : v;
}