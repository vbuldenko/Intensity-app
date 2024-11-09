import mongoose, { Document, Schema } from 'mongoose';

export interface IHistory extends Document {
  abonementId: mongoose.Types.ObjectId;
  trainingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema: Schema = new Schema(
  {
    abonementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Abonement',
      required: true,
    },
    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Training',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    tableName: 'History',
  },
);

HistorySchema.index(
  { abonementId: 1, trainingId: 1, userId: 1 },
  { unique: true },
);

const History = mongoose.model<IHistory>('History', HistorySchema);

export default History;
