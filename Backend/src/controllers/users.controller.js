const usersService = require("../services/users.service");

const get = async (req, res) => {
  // should make visible only to owner
  const users = await usersService.getAll();
  res.json(users);
};

const getOne = async (req, res) => {
  const { user } = req; //To ensure that authenticated user can acces his userdata

  if (user.role !== "admin" && user.id !== req.params.id) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const user = await usersService.getById(req.params.id);

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req, res, next) => {
  // Ensure that only the authenticated user can update their settings
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  try {
    const user = await usersService.update(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ error: "User is not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  try {
    await usersService.remove(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const removeMany = async (req, res, next) => {
  const { action } = req.query;
  const { ids } = req.body;

  if (req.user.role !== "admin") {
    return res.status(401).json({ error: "Access denied" });
  }

  if (action === "delete") {
    if (!Array.isArray(ids)) {
      res.status(422).json({ error: "not Array" });
      return;
    }

    try {
      await usersService.removeMany(ids);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  get,
  getOne,
  update,
  remove,
  removeMany,
};
