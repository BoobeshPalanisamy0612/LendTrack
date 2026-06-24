const asyncHandler = require('express-async-handler');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Loan = require('../models/Loan');
const { buildVisibilityFilter } = require('../utils/accessControl');

// @desc    Export loan records as PDF
// @route   GET /api/export/pdf
// @access  Private
const exportPDF = asyncHandler(async (req, res) => {
  const filter = buildVisibilityFilter(req.user);
  const loans = await Loan.find(filter).sort('-createdAt');

  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=lendtrack-records.pdf');
  doc.pipe(res);

  doc.fontSize(20).fillColor('#0B1F3A').text('LendTrack - Loan Records', { align: 'left' });
  doc.fontSize(10).fillColor('#8B95A6').text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'left' });
  doc.moveDown(1);

  let totalLent = 0;
  let totalBorrowed = 0;

  const tableTop = doc.y;
  const colWidths = [110, 70, 70, 70, 70, 80];
  const headers = ['Person', 'Type', 'Amount', 'Rate %', 'Due date', 'Status'];

  const drawRow = (y, cells, isHeader = false) => {
    let x = 40;
    cells.forEach((cell, i) => {
      doc
        .fontSize(9)
        .fillColor(isHeader ? '#0B1F3A' : '#1a1a1a')
        .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
        .text(String(cell), x, y, { width: colWidths[i], ellipsis: true });
      x += colWidths[i];
    });
  };

  drawRow(tableTop, headers, true);
  doc
    .moveTo(40, tableTop + 14)
    .lineTo(40 + colWidths.reduce((a, b) => a + b, 0), tableTop + 14)
    .strokeColor('#D9D5C9')
    .stroke();

  let y = tableTop + 22;

  loans.forEach((loan) => {
    if (y > 760) {
      doc.addPage();
      y = 40;
    }
    if (loan.type === 'lent') totalLent += loan.amount;
    else totalBorrowed += loan.amount;

    drawRow(y, [
      loan.personName,
      loan.type === 'lent' ? 'Lent' : 'Borrowed',
      `Rs. ${loan.amount.toLocaleString()}`,
      `${loan.interestRate}%`,
      new Date(loan.dueDate).toLocaleDateString(),
      loan.status.replace('_', ' '),
    ]);
    y += 20;
  });

  doc.moveDown(2);
  doc.fontSize(11).fillColor('#2F9E6E').text(`Total lent: Rs. ${totalLent.toLocaleString()}`, 40, y + 20);
  doc.fontSize(11).fillColor('#D9763B').text(`Total borrowed: Rs. ${totalBorrowed.toLocaleString()}`, 40, y + 38);

  doc.end();
});

// @desc    Export loan records as Excel
// @route   GET /api/export/excel
// @access  Private
const exportExcel = asyncHandler(async (req, res) => {
  const filter = buildVisibilityFilter(req.user);
  const loans = await Loan.find(filter).sort('-createdAt');

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'LendTrack';
  const sheet = workbook.addWorksheet('Loan Records');

  sheet.columns = [
    { header: 'Person', key: 'personName', width: 22 },
    { header: 'Relationship', key: 'relationship', width: 16 },
    { header: 'Type', key: 'type', width: 12 },
    { header: 'Amount', key: 'amount', width: 14 },
    { header: 'Amount Paid', key: 'amountPaid', width: 14 },
    { header: 'Interest Rate (%)', key: 'interestRate', width: 16 },
    { header: 'Interest Type', key: 'interestType', width: 14 },
    { header: 'Start Date', key: 'startDate', width: 14 },
    { header: 'Due Date', key: 'dueDate', width: 14 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Notes', key: 'notes', width: 30 },
  ];

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B1F3A' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  });

  loans.forEach((loan) => {
    sheet.addRow({
      personName: loan.personName,
      relationship: loan.relationship,
      type: loan.type === 'lent' ? 'Lent' : 'Borrowed',
      amount: loan.amount,
      amountPaid: loan.amountPaid,
      interestRate: loan.interestRate,
      interestType: loan.interestType,
      startDate: new Date(loan.startDate).toLocaleDateString(),
      dueDate: new Date(loan.dueDate).toLocaleDateString(),
      status: loan.status.replace('_', ' '),
      notes: loan.notes || '',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=lendtrack-records.xlsx');

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = { exportPDF, exportExcel };
