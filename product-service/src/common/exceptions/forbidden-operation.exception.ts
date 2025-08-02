import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenOperationException extends HttpException {
    constructor(message = 'Operation not allowed') {
        super(message, HttpStatus.FORBIDDEN);
    }
}
