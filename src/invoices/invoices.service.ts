import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoicePaymentTerms } from './schemas/invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const invoice = new this.invoiceModel(createInvoiceDto);

      const paymentDue = this.#getPaymentDue(createInvoiceDto.paymentTerms);
      invoice.paymentDue = paymentDue;

      return invoice.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findAll() {
    return `This action returns all invoices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }

  #getPaymentDue(days: InvoicePaymentTerms): Date {
    const currentDate = new Date();

    return new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
}
