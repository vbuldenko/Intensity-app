const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const users = await User.findById(request.params.id).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, surname, email, phone, password } = request.body;
  if (!password || !username || !surname || !email || !name) {
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
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
