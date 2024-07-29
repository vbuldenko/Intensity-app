// const Sales = require("../models/sales");
const { collectStatistics } = require("../utils/statisticsCollector");

const get = async () => {
  // const sales = await Sales.find({});
  return await collectStatistics();
};

module.exports = { get };
