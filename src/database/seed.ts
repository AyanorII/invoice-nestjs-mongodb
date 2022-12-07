import { NestFactory } from '@nestjs/core';
import { SeedsService } from 'src/seeds/seeds.service';
import { SeedsModule } from '../seeds/seeds.module';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(SeedsModule);
  const seedsService = app.get(SeedsService);

  try {
    await seedsService.drop();
    await seedsService.seed();
    console.log('Seeding complete');
  } catch (err) {
    console.log(err);
  } finally {
    console.log('Closing app');
    app.close();
  }
};

bootstrap();
