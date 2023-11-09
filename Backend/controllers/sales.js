const salesRouter = require("express").Router();
const Sales = require("../models/sales");
const userExtractor = require("../utils/middleware").userExtractor;
const { collectStatistics } = require("../utils/statisticsCollector");

salesRouter.get("/", userExtractor, async (request, response, next) => {
    const user = request.user;

    try {
        if (!user.role === "admin") {
            return response
                .status(401)
                .json({ error: "Unauthorized for this data!" });
        }
        // const sales = await Sales.find({});
        const sales = await collectStatistics();
        response.json(sales);
    } catch (error) {
        next(error);
    }
});

// salesRouter.put("/:id", userExtractor, async (request, response, next) => {
//     const salesDataId = request.params.id;
//     const user = request.user;

//     try {
//         if (!user) {
//             return response
//                 .status(401)
//                 .json({ error: "Unauthorized: User not authenticated!" });
//         }

//         const salesData = await Sales.findById(salesDataId);
//         if (!salesData) {
//             return response.status(404).json({ error: "Not found" });
//         }

//         const savedSalesData = await salesData.save();
//         console.log(savedSalesData);
//         response.json(savedSalesData);
//     } catch (error) {
//         next(error);
//     }
// });

// salesRouter.post("/", userExtractor, async (request, response, next) => {
//     const { body, user } = request;

//     try {
//         if (!user) {
//             return response
//                 .status(401)
//                 .json({ error: "operation not permitted" });
//         }

//         const newSalesData = new Sales(body);
//         const savedSalesData = await newSalesData.save();

//         response.status(201).json(savedSalesData);
//     } catch (error) {
//         console.log(body);
//         next(error);
//     }
// });

// salesRouter.delete("/", async (request, response, next) => {
//     try {
//         await Sales.deleteMany({});
//         response.status(204).end();
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = salesRouter;
