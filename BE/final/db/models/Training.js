import mongoose, { Schema } from 'mongoose';
import { toZonedTime, format } from 'date-fns-tz';
const timeZone = 'Europe/Kiev';

const TrainingSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ['group', 'personal', 'split'],
      default: 'group',
    },
    capacity: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    day: {
      type: String,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    instructor: {
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

const Training = mongoose.model('Training', TrainingSchema);
export default Training;
