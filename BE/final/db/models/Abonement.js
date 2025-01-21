import mongoose, { Schema } from 'mongoose';
const AbonementSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'ended', 'expired', 'inactive'],
      required: true,
    },
    type: {
      type: String,
      enum: ['group', 'personal', 'split'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    left: {
      type: Number,
      required: true,
    },
    activatedAt: {
      type: Date,
    },
    expiratedAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
      },
    ],
    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      default: 'card',
    },
  },
  {
    timestamps: true,
    tableName: 'Abonement',
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);
const Abonement = mongoose.model('Abonement', AbonementSchema);
export default Abonement;
