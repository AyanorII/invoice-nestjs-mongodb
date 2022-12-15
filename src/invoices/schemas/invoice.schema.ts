import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address, AddressSchema } from './address.schema';
import { Client, ClientSchema } from './client.schema';
import { Item, ItemSchema } from './item.schema';

export enum InvoicePaymentTerms {
  ONE_DAY = 1,
  ONE_WEEK = 7,
  TWO_WEEKS = 14,
  ONE_MONTH = 30,
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
}

const DEFAULT_PAYMENT_TERMS = InvoicePaymentTerms.ONE_WEEK;
const DEFAULT_STATUS = InvoiceStatus.PENDING;
@Schema({
  timestamps: true,
})
export class Invoice extends Document {
  @Prop({ required: true, index: true, unique: true })
  code: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: InvoicePaymentTerms,
    default: DEFAULT_PAYMENT_TERMS,
  })
  paymentTerms: InvoicePaymentTerms;

  @Prop({ required: true, enum: InvoiceStatus, default: DEFAULT_STATUS })
  status: InvoiceStatus;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  paymentDue: Date;

  @Prop({ required: true, type: ClientSchema })
  client: Client;

  @Prop({ required: true, type: AddressSchema })
  sender: Address;

  @Prop({ required: true, type: [ItemSchema] })
  items: Item[];

  @Prop({ required: true })
  createdAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
