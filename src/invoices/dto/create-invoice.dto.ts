import { Address } from '../schemas/address.schema';
import { Client } from '../schemas/client.schema';
import { Item } from '../schemas/item.schema';

export class CreateInvoiceDto {
  readonly code: string;
  readonly description: string;
  readonly paymentTerms: number;
  readonly status: number;
  readonly total: number;
  readonly createdAt: Date;
  readonly paymentDue: Date;
  readonly client: Client;
  readonly sender: Address;
  readonly items: Item[];
}
