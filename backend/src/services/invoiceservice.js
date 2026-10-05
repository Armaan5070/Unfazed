import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = async (invoice, client, therapist, appointment) => {

    const invoiceDirectory = path.join(
        process.cwd(),
        "invoices"
    );

    // Create invoices folder if it doesn't exist
    if (!fs.existsSync(invoiceDirectory)) {
        fs.mkdirSync(invoiceDirectory, {
            recursive: true
        });
    }

    const fileName = `${invoice.invoiceNumber}.pdf`;

    const filePath = path.join(
        invoiceDirectory,
        fileName
    );

    const doc = new PDFDocument({
        margin: 50
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // =========================
    // HEADER
    // =========================

    doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("UNFAZED");

    doc
        .fontSize(10)
        .font("Helvetica")
        .text("Therapy & Wellness");

    doc.moveDown(2);

    doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("INVOICE");

    doc.moveDown();

    // =========================
    // INVOICE DETAILS
    // =========================

    doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Invoice Number: ${invoice.invoiceNumber}`)
        .text(
            `Invoice Date: ${new Date(
                invoice.invoiceDate
            ).toLocaleDateString()}`
        );

    doc.moveDown(2);

    // =========================
    // CLIENT
    // =========================

    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Bill To");

    doc
        .fontSize(10)
        .font("Helvetica")
        .text(appointment.bookedBy.name)
        .text(appointment.bookedBy.email)
        .text(appointment.bookedBy.phone);

    doc.moveDown(2);
    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Booked for");

    doc
        .fontSize(10)
        .font("Helvetica")
        .text(client.name)
        .text(client.email)
        .text(client.phone);

    doc.moveDown(2);

    // =========================
    // THERAPIST
    // =========================

    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Therapist");

    doc
        .fontSize(10)
        .font("Helvetica")
        .text(therapist.name)
        .text(therapist.email);

    doc.moveDown(2);

    // =========================
    // APPOINTMENT
    // =========================

    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Appointment");

    doc
        .fontSize(10)
        .font("Helvetica")
        .text(
            `Date: ${new Date(
                appointment.startTime
            ).toLocaleDateString()}`
        )
        .text(
            `Time: ${new Date(
                appointment.startTime
            ).toLocaleTimeString()} - ${new Date(
                appointment.endTime
            ).toLocaleTimeString()}`
        )
        .text("Description: Therapy Session");

    doc.moveDown(2);

    // =========================
    // PAYMENT DETAILS
    // =========================

    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Payment Details");

    doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Session Fee: ₹${invoice.amount}`)
        .text(`Platform Fee: ₹${invoice.platformFee}`)
        .text(`Net Amount: ₹${invoice.netAmount}`)
        .text(`Tax: ₹${invoice.taxAmount}`);

    doc.moveDown();

    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`Total Amount: ₹${invoice.totalAmount}`);

    doc.moveDown(2);

    // =========================
    // TRANSACTION
    // =========================

    doc
        .fontSize(10)
        .font("Helvetica")
        .text("Payment Status: PAID")
        .text(`Transaction ID: ${invoice.transactionId}`);

    doc.moveDown(3);

    doc
        .fontSize(10)
        .text("Thank you for choosing Unfazed.");

    doc.end();

    // Wait until PDF is completely written
    await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
    });

    return filePath;
};