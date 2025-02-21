import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { saveAs } from "file-saver";

export const generateTicket = async (eventId: string, userId: string) => {
  try {
    const eventRef = doc(collection(db, "events"), eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found");
    const eventData = eventSnap.data();
    const qrCodeData = JSON.stringify({ eventId, userId });
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([420, 220]); 
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const qrImage = await pdfDoc.embedPng(qrCodeDataURL);
    const qrSize = 80;

    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.9, 0.9, 0.9), 
      borderColor: rgb(0.1, 0.1, 0.1),
      borderWidth: 2,
    });

    page.drawRectangle({
      x: 0,
      y: height - 40,
      width,
      height: 40,
      color: rgb(0.65, 0.16, 0.16), 
    });

    page.drawText("PUP GATHER", {
      x: width / 2 - 60,
      y: height - 30,
      size: 16,
      font,
      color: rgb(1, 1, 1),
    });

    const detailsStartY = height - 60;
    const lineSpacing = 18;

    page.drawText(`Event: ${eventData.eventName}`, {
      x: 20,
      y: detailsStartY,
      size: 12,
      font: regularFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${eventData.startDate} at ${eventData.startTime}`, {
      x: 20,
      y: detailsStartY - lineSpacing,
      size: 12,
      font: regularFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Location: ${eventData.location}`, {
      x: 20,
      y: detailsStartY - lineSpacing * 2,
      size: 12,
      font: regularFont,
      color: rgb(0, 0, 0),
    });

    page.drawImage(qrImage, {
      x: width - qrSize - 20,
      y: 30,
      width: qrSize,
      height: qrSize,
    });

    page.drawLine({
      start: { x: 20, y: 20 },
      end: { x: width - 20, y: 20 },
      thickness: 1,
      color: rgb(0.6, 0.6, 0.6),
    });

    page.drawText("Present this ticket at the entrance.", {
      x: 20,
      y: 10,
      size: 10,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `${eventData.eventName.replace(/\\s+/g, "_")}_Ticket.pdf`);
  } catch (error) {
    console.error("Error generating ticket:", error);
  }
};
