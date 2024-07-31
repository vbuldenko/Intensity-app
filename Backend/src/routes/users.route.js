const usersRouter = require("express").Router();
const userExtractor = require("../middlewares").userExtractor;
const usersController = require("../controllers/users.controller");

usersRouter.get("/", usersController.get);

usersRouter.get("/:id", userExtractor, usersController.getOne);

usersRouter.put("/:id", userExtractor, usersController.update);

usersRouter.delete("/:id", userExtractor, usersController.remove);

usersRouter.patch("/", userExtractor, usersController.removeMany);

module.exports = usersRouter;
