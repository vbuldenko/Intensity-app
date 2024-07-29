const salesService = require("../services/sales.service");

const get = async (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  try {
    const sales = salesService.get();
    res.json(sales);
  } catch (error) {
    next(error);
  }
};

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

module.exports = { get };
