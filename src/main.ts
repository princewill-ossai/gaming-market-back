import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
  origin: [
    "http://localhost:3000",
    "https://gaming-market.netlify.app"
  ],
  credentials: true,
});

  const port = process.env.PORT || 5000;

  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
