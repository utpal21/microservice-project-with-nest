import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    app.useGlobalFilters(new HttpExceptionFilter());

     // Apply AuthGuard globally
    const authGuard = app.get(AuthGuard);
    app.useGlobalGuards(authGuard);

    const logger = new Logger('Bootstrap');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`Product Service running on http://localhost:${port}`);
}
bootstrap();
