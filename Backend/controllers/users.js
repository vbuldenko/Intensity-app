const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const userExtractor = require("../utils/middleware").userExtractor;

usersRouter.get("/", async (request, response) => {
    // should make visible only to owner
    const users = await User.find({}).populate({
        path: "abonements",
        populate: {
            path: "history",
            model: "Training",
        },
    });
    response.json(users);
});

usersRouter.get("/:id", userExtractor, async (request, response) => {
    const { user } = request; //To ensure that authenticated user can acces his userdata

    if (user.id !== request.params.id) {
        return response.status(401).json({ error: "Access denied" });
    }

    try {
        const user = await User.findById(request.params.id);
        console.log(user);
        response.json(user);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

usersRouter.post("/", async (request, response, next) => {
    const { username, name, surname, email, phone, password, role } =
        request.body;
    if (
        !username ||
        !name ||
        !surname ||
        !email ||
        !phone ||
        !password ||
        !role
    ) {
        return response
            .status(400)
            .json({ error: "All form details are required!" });
    }

    if (password.length < 4) {
        return response
            .status(400)
            .json({ error: "Password should be at least 4 characters long!" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        surname,
        email,
        phone,
        passwordHash,
        role,
    });

    try {
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
});

usersRouter.delete("/:id", userExtractor, async (request, response, next) => {
    const user = await User.findById(request.params.id);

    try {
        if (!user) {
            return response.status(404).json({ error: "User is not found" });
        }
        // Similarly look at user.id here too!!!
        if (request.user.id !== user.id) {
            return response
                .status(403)
                .json({ error: "Not authorized to delete this user" });
        }

        await User.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

module.exports = usersRouter;
