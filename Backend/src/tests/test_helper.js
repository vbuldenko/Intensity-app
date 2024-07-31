const User = require("../models/user");

const nonExistingId = async () => {
  const user = new User({
    username: "anzhel",
    name: "Anzhel",
    surname: "Buldenko",
    email: "anzhel@gmail.com",
    phone: "0979910029",
    password: "rfrfirf21",
    role: "client",
  });
  await user.save();
  await user.deleteOne();

  return user._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  nonExistingId,
  usersInDb,
};
