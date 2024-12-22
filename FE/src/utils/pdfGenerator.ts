import jsPDF from "jspdf";

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
  doc.text(`Total Income: ${totalIncome} UAH`, 10, 10);

  // Draw rounded border blocks for Cash Income and Card Income
  doc.setDrawColor(0, 0, 0); // Black color for border
  doc.roundedRect(10, 13, 80, 13, 3, 3); // x, y, width, height, rx, ry
  doc.roundedRect(120, 13, 80, 13, 3, 3); // x, y, width, height, rx, ry

  // Add cash and card income on a separate line
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text(`Cash Income: ${cashIncome} UAH`, 15, 20);
  doc.text(`Card Income: ${cardIncome} UAH`, 125, 20);

  // Add a gap after the title
  let yOffset = 40; // Start the yOffset after the title with a gap

  abonements.forEach((abonementStat, index) => {
    const currentYOffset = yOffset + index * 40; // Adjust the vertical position for each abonement

    // Draw a gray, dotted line at the top to separate abonements
    doc.setLineWidth(0.25);
    doc.setDrawColor(169, 169, 169); // Gray color
    doc.setLineDashPattern([1, 1], 0); // Dotted line
    doc.line(10, currentYOffset - 10, 200, currentYOffset - 10);

    // Set the text style for each abonement
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color

    // Holder Name and Date of Purchase on one line
    doc.text(
      `Holder Name: ${abonementStat?.user.firstName.toUpperCase()} ${abonementStat?.user.lastName.toUpperCase()}`,
      10,
      currentYOffset
    );
    if (abonementStat?.paymentMethod === "cash") {
      doc.setTextColor(255, 0, 0); // Red color for cash
    } else {
      doc.setTextColor(0, 0, 0); // Black color for other methods
    }
    doc.text(
      `Payment Method: ${abonementStat?.paymentMethod}`,
      150,
      currentYOffset
    );
    doc.setTextColor(0, 0, 0); // Reset to black for other text

    // Payment Method, Price, and Amount of Trainings on the second line
    doc.text(
      `Purchase Date: ${abonementStat?.createdAt.slice(0, 10)}`,
      10,
      currentYOffset + 10
    );
    doc.text(`Price: ${abonementStat?.price}`, 80, currentYOffset + 10);
    doc.text(
      `Amount of Trainings: ${abonementStat?.amount}`,
      150,
      currentYOffset + 10
    );

    // Draw a gray, dotted line at the bottom to separate abonements
    doc.line(10, currentYOffset + 20, 200, currentYOffset + 20);
    doc.setLineDashPattern([], 0); // Reset line dash to avoid unintended dotted lines if there is content below
  });

  doc.save("abonement-details.pdf");
};
