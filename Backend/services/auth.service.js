const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendResetPasswordEmail = require("../utils/email");

const generateToken = (userId, expiresIn) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};
const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const findUserByIdentifier = async (identifier) => {
  if (identifier.includes("@")) {
    return await User.findOne({ email: identifier });
  } else if (/^\d+$/.test(identifier)) {
    return await User.findOne({ phone: identifier });
  } else {
    return await User.findOne({ username: identifier });
  }
};

const comparePasswords = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const hashPassword = async (password, saltRounds = 10) => {
  return await bcrypt.hash(password, saltRounds);
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

module.exports = {
  generateToken,
  decodeToken,
  findUserByIdentifier,
  comparePasswords,
  hashPassword,
  findUserById,
  createUser,
  sendResetPasswordEmail,
};
