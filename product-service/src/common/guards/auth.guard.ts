import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { PublisherService } from '../../rabbitmq/publisher.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly publisher: PublisherService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.replace(/^Bearer\s+/, '');
    this.logger.log('🔒 Validating token via RabbitMQ');

    const result = await this.publisher.validateToken(token);
     console.log('✅ Token decoded in AuthService:', result);

    if (!result?.valid) throw new ForbiddenException('Invalid token');

    // ✅ Attach decoded user payload to request
    request.user = result.payload;

    return true;
  }
}




// import {
//     Injectable,
//     CanActivate,
//     ExecutionContext,
//     UnauthorizedException,
//     Inject,
//     Logger,
// } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class AuthGuard implements CanActivate {
//     private readonly logger = new Logger(AuthGuard.name);

//     constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     const authHeader = request.headers['authorization'];
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         throw new UnauthorizedException('Missing or invalid Authorization header');
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         this.logger.log('Validating token via RabbitMQ');
//         const response = await firstValueFrom(
//         this.client.send({ cmd: 'validate_token' }, { token }),
//         );

//         if (!response?.valid) throw new UnauthorizedException('Invalid token');

//         request.user = response.payload;
//         return true;
//     } catch (err: any) {
//         this.logger.error(`Token validation failed: ${err.message}`);
//         throw new UnauthorizedException('Invalid token');
//     }
//     }
// }
