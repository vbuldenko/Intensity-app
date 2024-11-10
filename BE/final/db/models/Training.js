import mongoose, { Schema } from 'mongoose';
const TrainingSchema = new Schema({
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
    visitors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
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
});
const Training = mongoose.model('Training', TrainingSchema);
export default Training;
