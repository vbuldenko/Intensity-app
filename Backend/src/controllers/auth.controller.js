const authService = require("../services/auth.service");

const login = async (req, res, next) => {
  const { identifier, password } = req.body;

  try {
    const user = await authService.findUserByIdentifier(identifier);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await authService.comparePasswords(
      password,
      user.passwordHash
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = authService.generateToken(user._id, "1d");
    res.status(200).send({ token, id: user._id, role: user.role });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { username, name, surname, email, phone, password, role } = req.body;

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

  if (password.length < 4) {
    return res
      .status(400)
      .json({ error: "Password should be at least 4 characters long!" });
  }

  try {
    const existingUser =
      (await authService.findUserByIdentifier(email)) ||
      (await authService.findUserByIdentifier(username));
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email or username already exists" });
    }

    const passwordHash = await authService.hashPassword(password);
    const newUser = await authService.createUser({
      username,
      name,
      surname,
      email,
      phone,
      passwordHash,
      role,
    });

    // Set token expiration time
    const expiresIn = 1 * 24 * 60 * 60; // 1 day in seconds

    const token = authService.generateToken(newUser._id, expiresIn);
    res.status(201).send({ token, id: newUser._id, role: newUser.role });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await authService.findUserByIdentifier(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = authService.generateToken(user._id, "1d");
    await authService.sendResetPasswordEmail(user.email, token);

    res.json({ message: "Reset password instructions sent to your email" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const decodedToken = authService.decodeToken(token);

    if (!decodedToken.userId) {
      return res.status(401).json({ error: "Token invalid" });
    }

    const user = await authService.findUserById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await authService.hashPassword(newPassword);
    user.passwordHash = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
