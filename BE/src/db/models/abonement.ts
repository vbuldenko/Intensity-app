import mongoose, { Document, Schema } from 'mongoose';

export interface IAbonement extends Document {
  user: mongoose.Types.ObjectId;
  status: 'active' | 'ended' | 'expired' | 'inactive';
  type: string;
  amount: number;
  price: number;
  left: number;
  paused: boolean;
  activatedAt: Date;
  expiratedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  reservations: any[];
  paymentMethod: 'card' | 'cash';
}

const AbonementSchema: Schema = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'ended', 'expired', 'inactive'],
      required: true,
    },
    type: {
      type: String,
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

const Abonement = mongoose.model<IAbonement>('Abonement', AbonementSchema);

export default Abonement;
