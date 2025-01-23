import mongoose, { Document, Schema } from 'mongoose';
import Abonement from './abonement';
import Training from './training';

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

// Middleware to remove the reservation ID from Abonement and Training.reservations
// ReservationSchema.pre('deleteOne', async function (next) {
//   const reservation = await this.model.findOne(this.getFilter());
//   if (reservation) {
//     await Abonement.updateOne(
//       { _id: reservation.abonement },
//       { $pull: { reservations: reservation._id } },
//     );
//     await Training.updateOne(
//       { _id: reservation.training },
//       { $pull: { reservations: reservation._id } },
//     );
//   }
//   next();
// });

const Reservation = mongoose.model<IReservation>(
  'Reservation',
  ReservationSchema,
);

export default Reservation;
