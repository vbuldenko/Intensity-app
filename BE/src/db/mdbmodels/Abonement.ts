import mongoose, { Document, Schema } from 'mongoose';

export interface IAbonement extends Document {
  user: mongoose.Types.ObjectId;
  status: 'active' | 'ended' | 'inactive';
  type: string;
  amount: number;
  price: number;
  left: number;
  paused: boolean;
  activatedAt: Date;
  expiratedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  visitedTrainings: mongoose.Types.ObjectId[];
}

const AbonementSchema: Schema = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'ended', 'inactive'],
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
    paused: {
      type: Boolean,
      default: false,
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
    visitedTrainings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
      },
    ],
  },
  {
    timestamps: true,
    tableName: 'Abonement',
  },
);

const Abonement = mongoose.model<IAbonement>('Abonement', AbonementSchema);

export default Abonement;
