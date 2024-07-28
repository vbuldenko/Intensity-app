const Abonement = require("../models/abonement");
const User = require("../models/user");

const getAllAbonements = async () => {
  return await Abonement.find({}).populate({
    path: "user",
    select: "surname name",
  });
};

const getAbonementById = async (id) => {
  return await Abonement.findById(id);
};

const updateAbonement = async (abonementId, body, user) => {
  const abonement = await Abonement.findById(abonementId);
  if (!abonement || abonement.user.toString() !== user.id) {
    throw new Error("Abonement not found or not owned by the user.");
  }

  const currentDate = new Date();
  if (body.updateType === "freeze" && !abonement.paused) {
    abonement.paused = true;
    abonement.expiration_date.setDate(abonement.expiration_date.getDate() + 7);
  } else if (body.updateType === "freeze" && abonement.paused) {
    throw new Error("Abonement is already paused.");
  } else if (body.updateType === "reservation") {
    if (abonement.history.includes(body.trainingId)) {
      throw new Error("Training already reserved.");
    }

    if (!abonement.activation_date) {
      const expirationDate = new Date(currentDate);
      expirationDate.setMonth(currentDate.getMonth() + 1);

      abonement.activation_date = currentDate;
      abonement.expiration_date = expirationDate;
      abonement.status = "active";
    }
    abonement.left -= 1;
    if (abonement.left === 0) {
      abonement.status = "ended";
    }
    abonement.history.push(body.trainingId);
  } else if (body.updateType === "cancellation") {
    if (abonement.left === 0) {
      abonement.status = "active";
    }
    abonement.left += 1;
    abonement.history = abonement.history.filter(
      (id) => id.toString() !== body.trainingId
    );
  } else {
    return body.updateType;
  }

  const savedAbonement = await abonement.save();
  return await Abonement.findById(savedAbonement.id).populate({
    path: "history",
    populate: {
      path: "instructor",
    },
  });
};

const createAbonement = async (body, user) => {
  const { role } = user;

  const client = await User.findById(body.clientId);

  if (role === "admin" && !client) {
    throw new Error("Cannot find client");
  }

  const abonements = await Abonement.find({
    user: role === "admin" ? client.id : user.id,
  });

  if (
    abonements.some(
      (abonement) =>
        abonement.status === "active" || abonement.status === "non-active"
    )
  ) {
    throw new Error("Already have an abonement");
  }

  if (!body.amount || body.amount === 0) {
    throw new Error("Amount of days in abonement is not chosen");
  }

  const newAbonement = new Abonement({
    type: body.type,
    amount: body.amount,
    price: body.price,
    purchase_date: new Date(),
    paused: false,
    left: body.amount,
    status: "non-active",
    user: role === "admin" ? client.id : user.id,
  });

  const savedAbonement = await newAbonement.save();

  role === "admin"
    ? (client.abonements = client.abonements.concat(savedAbonement._id))
    : (user.abonements = user.abonements.concat(savedAbonement._id));

  role === "admin" ? await client.save() : await user.save();

  return savedAbonement;
};

const removeAbonement = async (abonementId, user) => {
  const abonement = await Abonement.findById(abonementId);
  if (!abonement) {
    throw new Error("Abonement not found");
  }
  if (user.role !== "admin") {
    throw new Error(
      "Unauthorized: You are not authorized to perform this operation."
    );
  }
  await Abonement.findByIdAndRemove(abonementId);

  if (user.role === "admin") {
    const client = await User.findById(abonement.user);
    client.abonements = client.abonements.filter(
      (id) => id.toString() !== abonementId
    );
    await client.save();
  } else {
    //For future considerations
    user.abonements = user.abonements.filter(
      (id) => id.toString() !== abonementId
    );
    await user.save();
  }
};

module.exports = {
  getAllAbonements,
  getAbonementById,
  updateAbonement,
  createAbonement,
  removeAbonement,
};
