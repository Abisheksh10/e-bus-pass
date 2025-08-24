import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'

export async function buildPassPdf(passDoc) {
  // Build QR payload (keep it simple but useful)
  const payload = {
    id: String(passDoc._id),
    rollno: passDoc.rollno,
    name: `${passDoc.fname} ${passDoc.lname}`,
    route: passDoc.route,
    validTill: passDoc.datevalid,
    passType: passDoc.passType,
    approved: !!passDoc.isAvailable
  }

  // Generate QR PNG Buffer
  const qrPngBuffer = await QRCode.toBuffer(JSON.stringify(payload), {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 1,
    scale: 5
  })

  // Prepare PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  // Header
  doc
    .fillColor('#0f172a')
    .fontSize(22)
    .text('E-Bus Pass', { align: 'left' })
    .moveDown(0.5)

  // Divider
  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor('#e5e7eb')
    .stroke()
    .moveDown(0.5)

  // Status badge
  const status = passDoc.isAvailable ? 'APPROVED' : 'PENDING'
  const badgeColor = passDoc.isAvailable ? '#16a34a' : '#f59e0b'
  doc
    .fillColor(badgeColor)
    .fontSize(12)
    .text(`Status: ${status}`, { continued: false })
    .moveDown(0.5)

  // Body fields
  doc.fillColor('#111827').fontSize(12)
  const leftX = 50
  const rightX = 300
  const startY = doc.y

  doc.text(`Name: ${passDoc.fname} ${passDoc.lname}`, leftX, startY)
  doc.text(`Roll No: ${passDoc.rollno}`, leftX, doc.y + 2)
  doc.text(`Year / Branch: ${passDoc.year} / ${passDoc.branch}`, leftX, doc.y + 2)
  doc.text(`Phone: ${passDoc.phno}`, leftX, doc.y + 2)
  doc.text(`Address: ${passDoc.address}`, leftX, doc.y + 2)

  doc.text(`Route: ${passDoc.route}`, rightX, startY)
  doc.text(`Bus No: ${passDoc.busno || '—'}`, rightX, doc.y + 2)
  doc.text(`Pass Type: ${String(passDoc.passType || '').toUpperCase()}`, rightX, doc.y + 2)
  doc.text(`Valid Till (MMYYYY): ${passDoc.datevalid}`, rightX, doc.y + 2)
  if (typeof passDoc.priceINR === 'number') {
    doc.text(`Fare: ₹ ${passDoc.priceINR}`, rightX, doc.y + 2)
  }

  // QR code box
  const qrX = 50
  const qrY = Math.max(doc.y + 12, 260)
  doc
    .rect(qrX - 10, qrY - 10, 140, 140)
    .strokeColor('#e5e7eb')
    .stroke()

  doc.image(qrPngBuffer, qrX, qrY, { fit: [120, 120] })

  // Footer
  doc
    .fillColor('#6b7280')
    .fontSize(10)
    .text('This pass is valid only for the named student and specified route.', 50, 720, { width: 495, align: 'center' })
    .text('Please carry your college ID along with this pass.', { width: 495, align: 'center' })

  return doc
}
