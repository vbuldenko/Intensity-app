const abonementRouter = require("express").Router();
const Abonement = require("../models/abonement");
const userExtractor = require("../utils/middleware").userExtractor;

abonementRouter.get("/", async (request, response, next) => {
    try {
        const abonements = await Abonement.find({}).populate("user", {
            surname: 1,
            name: 1,
        });
        response.json(abonements);
    } catch (error) {
        next(error);
    }
});

// get abonnements by user ID
abonementRouter.get("/user", userExtractor, async (request, response, next) => {
    const { user } = request;
    try {
        if (!user) {
            return response
                .status(401)
                .json({ error: "operation not permitted" });
        }

        const abonnements = await Abonement.find({ user: user.id }).populate(
            "history"
        );
        response.json(abonnements);
    } catch (error) {
        next(error);
    }
});

abonementRouter.get("/:id", async (request, response, next) => {
    try {
        const abonement = await Abonement.findById(request.params.id);
        if (abonement) {
            response.json(abonement);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        next(error);
    }
});

abonementRouter.post("/", userExtractor, async (request, response, next) => {
    const { body, user } = request;

    try {
        if (!user) {
            return response
                .status(401)
                .json({ error: "operation not permitted" });
        }
        //responds with status 400 if there no title or url properties in the request
        if (!body.amount || body.amount === 0) {
            return response
                .status(400)
                .json({ error: "Amount of days in abonement is not choosed" });
        }

        //Adding properties not declared in the first place
        body.purchase_date = new Date();
        body.paused = false;
        body.left = body.amount;

        const abonement = new Abonement({ ...body, user: user.id }); //Why here user.id and not user._id? Why there no error? Lookup later for better understanding!!!
        const savedAbonement = await abonement.save();
        console.log(savedAbonement);
        user.abonements = user.abonements.concat(savedAbonement._id);
        await user.save();
        response.status(201).json(savedAbonement);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

abonementRouter.put("/:id", userExtractor, async (request, response, next) => {
    const abonementId = request.params.id;
    const { body, user } = request;
    const { updateType } = body;

    try {
        if (!user) {
            return response
                .status(401)
                .json({ error: "operation not permitted" });
        }

        const abonement = await Abonement.findById(abonementId);
        if (!abonement) {
            return response.status(404).json({ error: "Abonement not found." });
        }

        if (updateType === "activation" && !abonement.activation_date) {
            const currentDate = new Date();
            // Calculate the expiration date by adding one month to the current date
            const expirationDate = new Date(currentDate);
            expirationDate.setMonth(currentDate.getMonth() + 1);

            abonement.activation_date = currentDate;
            abonement.expiration_date = expirationDate;
        } else if (updateType === "activation" && abonement.activation_date) {
            return response
                .status(401)
                .json({ error: "abonement already activated" });
        }

        if (new Date(abonement.expiration_date) < new Date()) {
            return response
                .status(401)
                .json({ error: "abonement expired. Buy a new one!" });
        }

        if (updateType === "freeze" && !abonement.paused) {
            abonement.paused = true;
            // Calculate new expiration date by adding one week
            const newExpirationDate = new Date(abonement.expiration_date);
            newExpirationDate.setDate(newExpirationDate.getDate() + 7);
            abonement.expiration_date = newExpirationDate;
        } else if (updateType === "freeze" && abonement.paused) {
            return response
                .status(400)
                .json({ error: "abonement was already paused!" });
        }

        if (updateType === "reservation") {
            abonement.left -= 1; //deduct 1 training from active abonement
            abonement.history.push(body.trainingId); //wy not _id?
        } else if (updateType === "cancellation") {
            abonement.left += 1; //return 1 training to active abonement
            abonement.history = abonement.history.filter(
                (id) => id.toString() !== body.trainingId
            );
        }

        // const update = {
        //     $set: {
        //         // Specify the new values
        //         ...abonementBody,
        //     },
        // };

        // const updatedAbonement = await Abonement.findByIdAndUpdate(
        //     abonementId,
        //     update,
        //     {
        //         new: true,
        //         runValidators: true,
        //         context: "query",
        //     }
        // );
        const savedAbonement = await abonement.save();
        const populatedAbonement = await Abonement.findById(
            savedAbonement.id
        ).populate("history");
        console.log(savedAbonement);
        response.json(populatedAbonement);
    } catch (error) {
        next(error);
    }
});

// abonementRouter.delete(
//   "/:id",
//   userExtractor,
//   async (request, response, next) => {
//     const user = request.user;
//     const blog = await Blog.findById(request.params.id);

//     try {
//       if (!blog) {
//         return response.status(404).json({ error: "Blog is not found" });
//       }
//       // Similarly look at user.id here too!!!
//       if (!user || blog.user.toString() !== user.id.toString()) {
//         return response
//           .status(403)
//           .json({ error: "Not authorized to delete this blog" });
//       }

//       user.blogs = user.blogs.filter(
//         (blogId) => blogId.toString() !== blog.id.toString()
//       );
//       await user.save();

//       await Blog.findByIdAndRemove(request.params.id);
//       response.status(204).end();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = abonementRouter;
