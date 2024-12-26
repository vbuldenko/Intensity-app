import jsPDF from "jspdf";
import "../assets/Roboto/robotoRegularConverted.js";

interface User {
  firstName: string;
  lastName: string;
}

interface Abonement {
  user: User;
  price: number;
  paymentMethod: "cash" | "card";
  createdAt: string;
  amount: number;
}

export const generatePDF = (abonements: Abonement[]): void => {
  const doc = new jsPDF();

  // Set the custom font
  doc.setFont("Roboto-Regular");

  // Calculate total income
  const totalIncome = abonements.reduce(
    (sum, abonement) => sum + abonement.price,
    0
  );
  // Calculate cash income and card income
  const cashIncome = abonements
    .filter((abonement) => abonement.paymentMethod === "cash")
    .reduce((sum, abonement) => sum + abonement.price, 0);

  const cardIncome = abonements
    .filter((abonement) => abonement.paymentMethod === "card")
    .reduce((sum, abonement) => sum + abonement.price, 0);

  // Set the title style
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 255); // Blue color
  doc.text(
    `Total Income: ${totalIncome} UAH; Total Abonements: ${abonements.length}`,
    10,
    10
  );

  // Add a margin after the title
  let yOffset = 25; // Adjust the yOffset to create a margin after the title

  // Draw rounded border blocks for Cash Income and Card Income
  doc.setDrawColor(0, 0, 0); // Black color for border
  doc.roundedRect(10, yOffset, 80, 13, 3, 3); // x, y, width, height, rx, ry
  doc.roundedRect(120, yOffset, 80, 13, 3, 3); // x, y, width, height, rx, ry

  // Add cash and card income on a separate line
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text(`Cash Income: ${cashIncome} UAH`, 15, yOffset + 7);
  doc.text(`Card Income: ${cardIncome} UAH`, 125, yOffset + 7);

  // Add a gap after the title and income details
  yOffset += 30; // Start the yOffset after the title and income details with a gap

  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  const lineHeight = 10;
  const abonementHeight = 30; // Height required for each abonement block
  const maxYOffset = pageHeight - margin;

  abonements.forEach((abonementStat) => {
    // Check if we need to add a new page
    if (yOffset + abonementHeight > maxYOffset) {
      doc.addPage();
      yOffset = margin + 20; // Add a gap at the top of each new page
    }

    // Draw a gray, dotted line at the top to separate abonements
    doc.setLineWidth(0.25);
    doc.setDrawColor(169, 169, 169); // Gray color
    doc.setLineDashPattern([1, 1], 0); // Dotted line
    doc.line(10, yOffset - 10, 200, yOffset - 10);

    // Set the text style for each abonement
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color

    // Holder Name and Date of Purchase on one line
    doc.text(
      `Holder Name: ${abonementStat?.user.firstName.toUpperCase()} ${abonementStat?.user.lastName.toUpperCase()}`,
      10,
      yOffset
    );
    if (abonementStat?.paymentMethod === "cash") {
      doc.setTextColor(255, 0, 0); // Red color for cash
    } else {
      doc.setTextColor(0, 0, 0); // Black color for other methods
    }
    doc.text(`Payment Method: ${abonementStat?.paymentMethod}`, 150, yOffset);
    doc.setTextColor(0, 0, 0); // Reset to black for other text

    // Payment Method, Price, and Amount of Trainings on the second line
    doc.text(
      `Purchase Date: ${abonementStat?.createdAt.slice(0, 10)}`,
      10,
      yOffset + lineHeight
    );
    doc.text(`Price: ${abonementStat?.price}`, 80, yOffset + lineHeight);
    doc.text(
      `Amount of Trainings: ${abonementStat?.amount}`,
      150,
      yOffset + lineHeight
    );

    // Draw a gray, dotted line at the bottom to separate abonements
    doc.line(10, yOffset + 20, 200, yOffset + 20);
    doc.setLineDashPattern([], 0); // Reset line dash to avoid unintended dotted lines if there is content below

    yOffset += abonementHeight; // Increment yOffset for the next abonement
  });

  doc.save("abonement-details.pdf");
};
