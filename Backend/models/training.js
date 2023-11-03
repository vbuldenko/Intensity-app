const mongoose = require("mongoose");

const daysEnum = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const trainingsEnum = [
  "Stretching",
  "Healthy Back",
  "ABS",
  "Fly Stretching",
  "Tabata",
  "Fly Yoga",
  "Yoga",
  "Functional",
  "Pilates",
  "Heels Basic",
  "Heels Pro",
  "Gymnastics",
  "Fly Kids (6-10)",
  "Fly Kids (11-16)",
];

const trainingSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  time: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: daysEnum, // Use the enum option to specify the allowed values
    required: true,
  },
  type: {
    type: String,
    enum: trainingsEnum,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  registeredClients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

trainingSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Training", trainingSchema);
