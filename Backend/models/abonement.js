const mongoose = require("mongoose");

const abonementSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  purchase_date: { type: Date },
  activated: Boolean,
  activation_date: { type: Date },
  expiration_date: { type: Date },
  expired: Boolean,
  paused: Boolean,
  left: Number,
  history: [
    {
      date: Date,
      time: Date,
      class: String,
      trainer: String,
      deducted: Boolean,
      deduction_reason: String,
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
