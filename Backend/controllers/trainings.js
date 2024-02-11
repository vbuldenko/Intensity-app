const trainingRouter = require("express").Router();
const Training = require("../models/training");
const userExtractor = require("../utils/middleware").userExtractor;
const initializeTrainingSessions = require("../utils/trainingsInitiator");

trainingRouter.get("/", async (request, response, next) => {
  try {
    const trainingSessions = await Training.find({}).populate("instructor", {
      surname: 1,
      name: 1,
    });
    console.log(trainingSessions.length);
    response.json(trainingSessions);
  } catch (error) {
    next(error);
  }
});

trainingRouter.put("/:id", userExtractor, async (request, response, next) => {
  const trainingId = request.params.id;
  const user = request.user;
  const { updateType } = request.body;

  try {
    if (!user || user.role !== "client") {
      return response.status(401).json({
        error: "Unauthorized: User not authenticated or not in client role.",
      });
    }

    const training = await Training.findById(trainingId);
    if (!training) {
      return response.status(404).json({ error: "Training not found." });
    }

    switch (updateType) {
      case "reservation":
        if (training.registeredClients.includes(user.id)) {
          return response.status(400).json({
            error: "Already reserved: You have already reserved your place!",
          });
        }
        training.registeredClients.push(user.id);
        break;
      case "cancellation":
        const index = training.registeredClients.indexOf(user.id);
        if (index === -1) {
          return response
            .status(400)
            .json({ error: "Not reserved: You have not reserved a place!" });
        }
        training.registeredClients.splice(index, 1);
        break;
      default:
        return response.status(400).json({ error: "Invalid updateType." });
    }

    const savedTraining = await training.save();
    const populatedTraining = await Training.findById(
      savedTraining.id
    ).populate("instructor");
    response.json(populatedTraining);
  } catch (error) {
    next(error);
  }
});

// trainingRouter.post("/", userExtractor, async (request, response, next) => {
//   const { body, user } = request;

//   try {
//     if (!user) {
//       return response.status(401).json({ error: "operation not permitted" });
//     }

//     const newTrainingSession = new Training(body);
//     const savedTrainingSession = await newTrainingSession.save();

//     response.status(201).json(savedTrainingSession);
//   } catch (error) {
//     console.log(body);
//     next(error);
//   }
// });

// trainingRouter.delete(
//   "/:id",
//   userExtractor,
//   async (request, response, next) => {
//     const user = request.user;
//     const training = await Training.findById(request.params.id);

//     try {
//       if (!training) {
//         return response.status(404).json({ error: "Training is not found" });
//       }
//       // Similarly look at user.id here too!!!
//       if (!user && !user.role === 'admin') {
//         return response
//           .status(403)
//           .json({ error: "Not authorized to delete this training" });
//       }

//       await Training.findByIdAndRemove(request.params.id);
//       response.status(204).end();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

trainingRouter.post("/", userExtractor, async (request, response, next) => {
  const { body, user } = request;

  try {
    if (!user) {
      return response.status(401).json({ error: "operation not permitted" });
    }
    initializeTrainingSessions(body.mode);
    response.status(201);
  } catch (error) {
    next(error);
  }
});

trainingRouter.delete("/", userExtractor, async (request, response, next) => {
  const user = request.user;

  try {
    if (!user) {
      return response
        .status(403)
        .json({ error: "Not authorized to delete all items" });
    }

    await Training.deleteMany({});
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = trainingRouter;
