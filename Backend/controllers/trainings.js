const trainingRouter = require("express").Router();
const Training = require("../models/training");
const Abonement = require("../models/abonement");
const userExtractor = require("../utils/middleware").userExtractor;
const predefinedSchedule = require("../utils/predefined_schedule");
const initializeTrainingSessions = require("../utils/trainingsInitiator");

trainingRouter.get("/", async (request, response, next) => {
    try {
        const trainingSessions = await Training.find({});
        response.json(trainingSessions);
    } catch (error) {
        next(error);
    }
});

trainingRouter.put("/:id", userExtractor, async (request, response, next) => {
    const trainingId = request.params.id;
    const user = request.user;
    const { updateType, abonementId } = request.body;

    try {
        if (!user) {
            return response
                .status(401)
                .json({ error: "Unauthorized: User not authenticated!" });
        }
        if (updateType !== "reservation" && updateType !== "cancellation") {
            return response.status(400).json({ error: "Invalid updateType." });
        }

        const training = await Training.findById(trainingId);
        const active_abonement = await Abonement.findById(abonementId);

        if (!training) {
            return response.status(404).json({ error: "Training not found." });
        }
        if (!active_abonement) {
            return response
                .status(404)
                .json({ error: "Active abonement not found." });
        }
        if (updateType === "reservation") {
            if (training.registeredClients.includes(user.id)) {
                return response.status(400).json({
                    error: "Already reserved: You have already reserved your place!",
                });
            }
            // //Activate abonement if it is not
            // if (!body.activation_date) {
            //     const currentDate = new Date();
            //     // Calculate the expiration date by adding one month to the current date
            //     const expirationDate = new Date(currentDate);
            //     expirationDate.setMonth(currentDate.getMonth() + 1);

            //     body.activation_date = currentDate;
            //     body.expiration_date = expirationDate;
            // }

            training.registeredClients.push(user.id); //add user id to list of registered clients
            active_abonement.left -= 1; //deduct 1 training from active abonement
            active_abonement.history.push(training.id); //wy not _id?
        } else if (updateType === "cancellation") {
            if (!training.registeredClients.includes(user.id)) {
                return response.status(400).json({
                    error: "Not reserved: You have not reserved a place!",
                });
            }

            training.registeredClients = training.registeredClients.filter(
                (clientId) => clientId.toString() !== user.id
            ); // delete user id from list of registered clients
            active_abonement.left += 1; //return 1 training to active abonement
            active_abonement.history = active_abonement.history.filter(
                (trainingId) => trainingId.toString() !== training.id
            );
        }

        const savedTraining = await training.save();
        await active_abonement.save();
        console.log(savedTraining);
        console.log(active_abonement);
        response.json(savedTraining);
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
            return response
                .status(401)
                .json({ error: "operation not permitted" });
        }
        initializeTrainingSessions();
        response.status(201);
    } catch (error) {
        console.log(body);
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
