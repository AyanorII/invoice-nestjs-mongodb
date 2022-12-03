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

  async findOneById(id: string): Promise<Invoice> {
    const invoice = await this.#findOneBy('id', id);
    return invoice;
  }

  async findOneByInvoiceCode(code: string): Promise<Invoice> {
    const invoice = await this.#findOneBy('code', code);
    return invoice;
  }

  async update(
    code: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    try {
      const invoice = await this.invoiceModel
        .findOneAndUpdate({ code }, updateInvoiceDto, {
          new: true,
        })
        .exec();
      return invoice;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  remove(code: string) {
    return `This action removes a #${code} invoice`;
  }

  /* --------------------------- Private methods ---------------------------- */
  /**
   * Find one invoice by a given field
   * @param field - The field to search by (ID or invoice code)
   * @param value - The value to search for (ID or invoice code)
   * @returns The invoice if found, otherwise throws a NotFoundException
   * @throws NotFoundException
   * @private
   * @memberof InvoicesService
   */
  async #findOneBy(field: 'id' | 'code', value: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ [field]: value }).exec();

    if (!invoice) {
      throw new NotFoundException(
        `Invoice with '${field}': ${value} not found`,
      );
    }

    return invoice;
  }

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
