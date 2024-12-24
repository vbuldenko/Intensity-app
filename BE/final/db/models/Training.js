import mongoose, { Schema } from 'mongoose';
import { toZonedTime, format } from 'date-fns-tz';
const timeZone = 'Europe/Kiev';

const TrainingSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
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

const convertToTimeZone = (date, timeZone) => {
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
};

// Middleware to convert date to the specified timezone after finding a document
TrainingSchema.post('find', function (docs) {
  docs.forEach(doc => {
    doc.date = convertToTimeZone(doc.date, timeZone);
  });
});

TrainingSchema.post('findOne', function (doc) {
  if (doc) {
    doc.date = convertToTimeZone(doc.date, timeZone);
  }
});

const Training = mongoose.model('Training', TrainingSchema);
export default Training;
