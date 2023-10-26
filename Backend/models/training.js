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
    "Yoga Stretch",
    "Yoga",
    "Functional",
    "Pilates",
    "Heels Basic",
    "Heels Pro",
    "Gymnastics",
    "Fly Kids Y",
    "Fly Kids O",
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
    training: {
        type: String,
        enum: trainingsEnum,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    maxCapacity: {
        type: Number,
        required: true,
    },
    registeredClients: [
        {
            type: String,
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
