const mongoose = require("mongoose");

// Definition of the schema for the saleStatistics document
const saleStatisticsSchema = new mongoose.Schema({
    totalIncome: Number,
    monthlyIncome: Number,
    monthlyProfit: Number,
    dailyIncome: Number,
    totalAbonementSales: Number,
});

saleStatisticsSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

// Create the Mongoose model for the "saleStatistics" collection
const SaleStatistics = mongoose.model("SaleStatistics", saleStatisticsSchema);

module.exports = SaleStatistics;
