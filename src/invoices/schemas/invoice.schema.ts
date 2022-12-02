import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address, AddressSchema } from './address.schema';
import { Client, ClientSchema } from './client.schema';
import { Item, ItemSchema } from './item.schema';

export enum InvoicePaymentTerms {
  ONE_DAY = 1,
  ONE_WEEK = 7,
  TWO_WEEKS = 14,
  ONE_MONTH = 30,
}

@Schema()
export class Invoice extends Document {
  @Prop({ required: true, index: true, unique: true })
  code: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  paymentTerms: number;

  @Prop({ required: true, enum: InvoicePaymentTerms })
  status: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  paymentDue: Date;

  @Prop({ required: true, type: ClientSchema })
  client: Client;

  @Prop({ required: true, type: AddressSchema })
  sender: Address;

  @Prop({ required: true, type: [ItemSchema] })
  items: Item[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
