const Abonement = require("../models/abonement");

// Function to calculate and return the total income
async function calculateTotalIncome() {
    const totalIncome = await Abonement.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$price" },
            },
        },
    ]);

    return totalIncome[0] ? totalIncome[0].total : 0;
}

// Function to calculate and return monthly income
async function calculateMonthlyIncome() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyIncome = await Abonement.aggregate([
        {
            $match: {
                purchase_date: { $gte: startOfMonth },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$price" },
            },
        },
    ]);

    return monthlyIncome[0] ? monthlyIncome[0].total : 0;
}

// Function to calculate and return income of the day
async function calculateIncomeOfTheDay() {
    const now = new Date();
    const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const dailyIncome = await Abonement.aggregate([
        {
            $match: {
                purchase_date: { $gte: startOfDay },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$price" },
            },
        },
    ]);

    return dailyIncome[0] ? dailyIncome[0].total : 0;
}

// Function to calculate and return total abonnement sales
async function calculateTotalAbonementSales() {
    const totalAbonementSales = await Abonement.countDocuments({});

    return totalAbonementSales;
}

async function collectStatistics() {
    const totalIncome = await calculateTotalIncome();
    const monthlyIncome = await calculateMonthlyIncome();
    const dailyIncome = await calculateIncomeOfTheDay();
    const totalAbonementSales = await calculateTotalAbonementSales();

    return { totalIncome, monthlyIncome, dailyIncome, totalAbonementSales };
}

module.exports = { collectStatistics };
