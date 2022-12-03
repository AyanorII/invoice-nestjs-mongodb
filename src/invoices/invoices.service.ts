import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createAlphabet, createNumbers, sample } from 'src/lib/helpers';
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

      invoice.code = this.#generateInvoiceCode();
      const paymentDue = this.#getPaymentDue(createInvoiceDto.paymentTerms);
      invoice.paymentDue = paymentDue;

      return invoice.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<Invoice[]> {
    const invoices = await this.invoiceModel.find().exec();

    return invoices;
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

  /* --------------------------- Private methods ---------------------------- */
  #getPaymentDue(days: InvoicePaymentTerms): Date {
    const currentDate = new Date();

    return new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  /**
   * Generates invoice code
   *
   * @returns Creates a random invoice code with the following format: AB1234
   * where A and B are random letters and 1234 are random numbers
   * @memberof InvoicesService
   * @private
   * @method
   * @name generateInvoiceCode
   */
  #generateInvoiceCode(): string {
    const alphabet = createAlphabet();
    const codeLetters = sample(alphabet) + sample(alphabet);

    const numbers = createNumbers();
    const codeNumbers: string[] = [];
    for (let i = 0; i < 4; i++) {
      codeNumbers.push(`${sample(numbers)}`);
    }

    return `${codeLetters}${codeNumbers.join('')}`;
  }
}
