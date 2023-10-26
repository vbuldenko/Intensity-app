const trainingRouter = require("express").Router();
const Training = require("../models/training");
const userExtractor = require("../utils/middleware").userExtractor;

trainingRouter.get("/", async (request, response, next) => {
    try {
        const trainingSessions = await Training.aggregate([
            {
                $group: {
                    _id: "$day", // Assuming 'day' is the field in your schema
                    trainings: { $push: "$$ROOT" }, // Store the entire document in the 'sessions' array
                },
            },
        ]);
        res.json(trainingSessions);
    } catch (error) {
        next(error);
    }
});

trainingRouter.put("/:id", async (request, response, next) => {
    const id = request.params.id;
    const updatedData = request.body;

    try {
        const updatedItem = await Training.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
            context: "query",
        });
        response.json(updatedItem);
    } catch (error) {
        next(error);
    }
});

trainingRouter.post("/", userExtractor, async (request, response, next) => {
    const { body, user } = request;

    try {
        if (!user) {
            return response
                .status(401)
                .json({ error: "operation not permitted" });
        }

        const newTrainingSession = new Training(body);
        const savedTrainingSession = await newTrainingSession.save();

        response.status(201).json(savedTrainingSession);
    } catch (error) {
        console.log(body);
        next(error);
    }
});

module.exports = trainingRouter;
