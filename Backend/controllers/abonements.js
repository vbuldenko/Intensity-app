const abonementRouter = require("express").Router();
const Abonement = require("../models/abonement");
const userExtractor = require("../utils/middleware").userExtractor;

abonementRouter.get("/", async (request, response, next) => {
    try {
        const abonements = await Abonement.find({});
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

        const abonnements = await Abonement.find({ user: user.id }).populate({
            history,
        });
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
        user.abonements = user.abonements.concat(savedAbonement._id);
        await user.save();
        response.status(201).json(savedAbonement);
    } catch (error) {
        console.log(body);
        next(error);
    }
});

abonementRouter.put("/:id", userExtractor, async (request, response, next) => {
    const abonementToUpdateId = request.params.id;
    const { body, user } = request;
    const { actionType, abonementBody } = body;

    try {
        if (!user) {
            return response
                .status(401)
                .json({ error: "operation not permitted" });
        }

        if (actionType === "activation" && !abonementBody.activation_date) {
            const currentDate = new Date();
            // Calculate the expiration date by adding one month to the current date
            const expirationDate = new Date(currentDate);
            expirationDate.setMonth(currentDate.getMonth() + 1);

            abonementBody.activation_date = currentDate;
            abonementBody.expiration_date = expirationDate;
        } else if (
            actionType === "activation" &&
            abonementBody.activation_date
        ) {
            return response
                .status(401)
                .json({ error: "abonement already activated" });
        }

        const update = {
            $set: {
                // Specify the new values
                ...abonementBody,
            },
        };

        const updatedAbonement = await Abonement.findByIdAndUpdate(
            abonementToUpdateId,
            update,
            {
                new: true,
                runValidators: true,
                context: "query",
            }
        );
        const populatedAbonement = await Abonement.findById(
            updatedAbonement._id
        ).populate("history");
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
