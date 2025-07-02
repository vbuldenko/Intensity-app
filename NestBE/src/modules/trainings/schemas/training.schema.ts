import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TrainingDocument = Training & Document;

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
export class Training {
  @Prop({ required: true })
  type: string;

  @Prop({
    enum: ['group', 'personal', 'split'],
    default: 'group',
  })
  format: 'group' | 'personal' | 'split';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  instructor: Types.ObjectId;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  date: Date;

  @Prop({
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
  })
  day: string;

  @Prop({ required: true })
  time: string;

  @Prop([{ type: Types.ObjectId, ref: 'Reservation' }])
  reservations: Types.ObjectId[];

  @Prop()
  isCancelled?: boolean;
}

export const TrainingSchema = SchemaFactory.createForClass(Training);
