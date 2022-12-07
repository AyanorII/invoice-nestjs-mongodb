import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

      invoice.code = await this.#generateInvoiceCode();
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

  async findOneByInvoiceCode(code: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ code }).exec();

    if (!invoice) {
      throw new NotFoundException(`Invoice with code: '${code}' not found`);
    }

    return invoice;
  }

  async update(
    code: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.invoiceModel
      .findOneAndUpdate({ code }, updateInvoiceDto, {
        new: true,
      })
      .exec();

    if (!invoice)
      throw new NotFoundException(`Invoice with code ${code} not found`);

    return invoice;
  }

  async remove(code: string): Promise<void> {
    const result = await this.invoiceModel.deleteOne({ code }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Invoice with code ${code} not found`);
    }
  }

  async _destroyAll(): Promise<void> {
    await this.invoiceModel.deleteMany({});
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
  async #generateInvoiceCode(): Promise<string> {
    const alphabet = createAlphabet();
    const codeLetters = sample(alphabet) + sample(alphabet);

    const numbers = createNumbers();
    const codeNumbers: string[] = [];
    for (let i = 0; i < 4; i++) {
      codeNumbers.push(`${sample(numbers)}`);
    }

    const invoiceCode = codeLetters + codeNumbers.join('');

    const invoiceAlreadyExists = await this.invoiceModel
      .findOne({
        code: invoiceCode,
      })
      .exec();

    if (invoiceAlreadyExists) {
      return this.#generateInvoiceCode();
    }

    return `${codeLetters}${codeNumbers.join('')}`;
  }
}
