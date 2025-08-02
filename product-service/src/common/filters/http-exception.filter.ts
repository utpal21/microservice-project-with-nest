import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            if (typeof res === 'string') {
            message = res;
            } else if (Array.isArray((res as any).message)) {
            message = (res as any).message.join(', ');
            } else {
            message = (res as any).message || 'An error occurred';
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        this.logger.error(
            `Status: ${status} | Path: ${request.url} | Message: ${message}`,
            exception instanceof Error ? exception.stack : '',
        );

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }

}
