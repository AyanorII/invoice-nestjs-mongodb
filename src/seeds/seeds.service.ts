import { Injectable, Logger } from '@nestjs/common';
import { InvoicesService } from 'src/invoices/invoices.service';
import { InvoiceStatus } from 'src/invoices/schemas/invoice.schema';
import { getRandomDate } from 'src/lib/helpers';
import data from './data.json';

@Injectable()
export class SeedsService {
  constructor(private readonly invoicesService: InvoicesService) {}

  private logger = new Logger('SeedsService', { timestamp: true });

  async seed() {
    try {
      const promises = data.map(async (invoice) => {
        const { status, ...rest } = invoice;
        this.logger.log(`Creating invoice with code: ${rest.code}`);
        const createdAt = getRandomDate(new Date(2022, 0, 1), new Date());
        await this.invoicesService.create({
          ...rest,
          status: status as InvoiceStatus,
          createdAt: createdAt.toISOString(),
        });
      });
      await Promise.all(promises);
      const invoices = await this.invoicesService.findAll();
      this.logger.log(`Created ${invoices.length} invoices`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async drop() {
    try {
      await this.invoicesService._destroyAll();
      this.logger.warn('Dropped all invoices');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
