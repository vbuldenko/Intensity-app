import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  training: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  abonement: mongoose.Types.ObjectId;
  status: string;
}

const ReservationSchema: Schema = new Schema(
  {
    training: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Training',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    abonement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Abonement',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
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

const Reservation = mongoose.model<IReservation>(
  'Reservation',
  ReservationSchema,
);

export default Reservation;
