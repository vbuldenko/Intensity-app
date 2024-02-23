const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
    const { identifier, password } = request.body;
    let user;
    if (identifier.includes("@")) {
        // If '@' is present, treat it as an email
        user = await User.findOne({ email: identifier });
    } else {
        // If no '@', treat it as a phone number
        user = await User.findOne({ phone: identifier });
    }
    // const user = await User.findOne({ email });
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "invalid username or password",
        });
    }

    const userForToken = {
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response.status(200).send({ token, id: user._id, role: user.role });
});

module.exports = loginRouter;
