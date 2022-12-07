import { Injectable } from '@nestjs/common';
import { InvoicesService } from 'src/invoices/invoices.service';
import { InvoiceStatus } from 'src/invoices/schemas/invoice.schema';
import data from './data.json';

@Injectable()
export class SeedsService {
  constructor(private readonly invoicesService: InvoicesService) {}

  async seed() {
    try {
      const promises = data.map(async (invoice) => {
        const { status, ...rest } = invoice;
        await this.invoicesService.create({
          ...rest,
          status: status as InvoiceStatus,
        });
      });
      await Promise.all(promises);
      const invoices = await this.invoicesService.findAll();
      console.log(`Created ${invoices.length} invoices`);
    } catch (error) {
      console.log(error);
    }
  }

  async drop() {
    try {
      await this.invoicesService._destroyAll();
      console.log('Dropped all invoices');
    } catch (error) {
      console.log(error);
    }
  }
}
