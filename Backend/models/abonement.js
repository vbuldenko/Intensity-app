const mongoose = require("mongoose");

const abonementSchema = new mongoose.Schema({
    status: String,
    type: String,
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    purchase_date: { type: Date, required: true },
    activation_date: { type: Date },
    expiration_date: { type: Date },
    paused: Boolean,
    left: Number,
    history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Training",
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

abonementSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Abonement", abonementSchema);
