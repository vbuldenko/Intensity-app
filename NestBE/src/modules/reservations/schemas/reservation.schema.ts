import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

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
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'Training', required: true })
  training: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Abonement', required: true })
  abonement: Types.ObjectId;

  @Prop({
    enum: ['active', 'cancelled'],
    default: 'active',
  })
  status: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
