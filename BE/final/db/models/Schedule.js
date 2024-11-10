import mongoose, { Schema } from 'mongoose';
const ScheduleSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    maxCapacity: {
        type: Number,
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
}, {
    timestamps: true,
    tableName: 'Schedule',
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
const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;
