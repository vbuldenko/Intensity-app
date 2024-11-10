import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    activationToken: {
        type: String,
        default: null,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    settings: {
        type: Map,
        of: Schema.Types.Mixed,
        default: { fontSize: 16 },
    },
    abonements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Abonement',
        },
    ],
    trainings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Training',
        },
    ],
    attendedTrainings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Training',
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
UserSchema.methods.getFullname = function () {
    return `${this.firstName} ${this.lastName}`;
};
const User = mongoose.model('User', UserSchema);
export default User;
