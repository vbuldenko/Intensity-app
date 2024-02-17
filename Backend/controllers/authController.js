const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const crypto = require("crypto");
const sendResetPasswordEmail = require("../utils/email");
const userExtractor = require("../utils/middleware").userExtractor;

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Set token expiration time
    const expiresIn = 1 * 24 * 60 * 60; // 7 days in seconds

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: expiresIn, // Token expiration time or "1h"
      }
    );

    // Send token in response
    // res.status(200).json({ token });
    res.status(200).send({ token, id: user._id, role: user.role });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", async (req, res, next) => {
  const { username, name, surname, email, phone, password, role } = req.body;

  try {
    if (
      !username ||
      !name ||
      !surname ||
      !email ||
      !phone ||
      !password ||
      !role
    ) {
      return res.status(400).json({ error: "All form details are required!" });
    }
    // Check if user with provided email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User with this email or username already exists",
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        error: "Password should be at least 4 characters long!",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      name,
      surname,
      email,
      phone,
      passwordHash,
      role,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expiration time
      }
    );

    // Send token in response
    // res.status(201).json({ token });
    res.status(201).send({ token, id: user._id, role: user.role });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/forgot-password", async (req, res, next) => {
  const { email } = req.body;
  console.log(req.body);

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    // const resetToken = crypto.randomBytes(20).toString("hex");

    // Set token expiration time
    const expiresIn = 1 * 24 * 60 * 60; // 1 day in seconds

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time or "1h"
    });

    // Set expiration time for reset token (e.g., 1 hour)
    // user.resetPasswordToken = token;
    // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in milliseconds
    // await user.save();

    // Send reset password email
    await sendResetPasswordEmail(user.email, token);

    res.json({
      message: "Reset password instructions sent to your email",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/reset-password", async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    // Find user
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify reset token and expiration time
    // if (
    //   user.resetPasswordToken !== token
    // ) {
    //   return res.status(400).json({ error: "Invalid or expired reset token" });
    // }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password and clear reset token
    user.passwordHash = hashedPassword;
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
