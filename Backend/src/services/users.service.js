const User = require("../models/user");
const bcrypt = require("bcrypt");

async function getAll() {
  return await User.find({}).populate({
    path: "abonements",
    populate: {
      path: "history",
      populate: {
        path: "instructor",
        select: "surname",
      },
    },
  });
}

async function getById(id) {
  return await User.findById(id).populate({
    path: "abonements",
    populate: {
      path: "history",
      populate: {
        path: "instructor",
        select: "surname",
      },
    },
  });
}

async function update(id, data) {
  const user = await User.findById(id);

  if (!user) {
    return null;
  }

  Object.assign(user, data);

  await user.save();

  return user;
}

async function remove(id) {
  const user = await User.findById(id);

  if (user) {
    await User.findByIdAndRemove(id);
  }
}

async function removeMany(ids) {
  if (ids.every((id) => User.findById(id))) {
    for (const id of ids) {
      await remove(id);
    }
  }
}

module.exports = {
  getAll,
  getById,
  update,
  remove,
  removeMany,
};
