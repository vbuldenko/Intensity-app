import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../../../common/enums';

export type UserDocument = User & Document;

const getIdFromRet = (ret: Record<string, unknown>): string | undefined => {
  if (
    '_id' in ret &&
    (typeof ret._id === 'string' ||
      (typeof ret._id === 'object' &&
        ret._id !== null &&
        'toString' in ret &&
        typeof (ret._id as { toString: unknown }).toString === 'function'))
  ) {
    return typeof ret._id === 'string'
      ? ret._id
      : (ret._id as { toString: () => string }).toString();
  }
  return undefined;
};

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc: unknown, ret: Record<string, unknown>) => {
      const id = getIdFromRet(ret);
      if (id) ret.id = id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc: unknown, ret: Record<string, unknown>) => {
      const id = getIdFromRet(ret);
      if (id) ret.id = id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ type: String, default: null })
  activationToken: string | null;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, required: true })
  role: UserRole;

  @Prop()
  profileImage?: string;

  @Prop()
  googleId?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  lastLogin?: Date;

  @Prop({
    type: {
      fontSize: { type: Number, default: 16 },
    },
    default: { fontSize: 16 },
  })
  settings: {
    fontSize: number;
  };

  @Prop([{ type: Types.ObjectId, ref: 'Abonement' }])
  abonements: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Training' }])
  trainings: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Training' }])
  attendedTrainings: Types.ObjectId[];

  // Method to get full name
  getFullname(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
