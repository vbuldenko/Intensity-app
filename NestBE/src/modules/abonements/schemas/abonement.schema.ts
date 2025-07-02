import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AbonementDocument = Abonement & Document;

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
export class Abonement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    enum: ['active', 'ended', 'expired', 'inactive'],
    required: true,
  })
  status: 'active' | 'ended' | 'expired' | 'inactive';

  @Prop({
    enum: ['group', 'personal', 'split'],
    required: true,
  })
  type: 'group' | 'personal' | 'split';

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  left: number;

  @Prop()
  activatedAt: Date;

  @Prop()
  expiratedAt: Date;

  @Prop([{ type: Types.ObjectId, ref: 'Reservation' }])
  reservations: Types.ObjectId[];

  @Prop({
    enum: ['card', 'cash'],
    default: 'card',
  })
  paymentMethod: 'card' | 'cash';

  @Prop({ default: false })
  extended: boolean;
}

export const AbonementSchema = SchemaFactory.createForClass(Abonement);
