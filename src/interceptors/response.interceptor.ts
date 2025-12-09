import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data: this.serializeBigInt(data),
        timestamp: new Date().toISOString(),
      }))
    );
  }

  private serializeBigInt(obj: any): any {
    try {
      if (obj === null || obj === undefined) {
        return obj;
      }

      if (typeof obj === 'bigint') {
        return obj.toString();
      }

      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return obj;
      }

      if (obj && typeof obj === 'object') {
        if (typeof obj.toString === 'function' && (obj.constructor?.name === 'Decimal' || (typeof obj === 'object' && 's' in obj && 'e' in obj))) {
          try {
            return obj.toString();
          } catch (_e) {
            return obj;
          }
        }
      }

      if (Array.isArray(obj)) {
        return obj.map(item => this.serializeBigInt(item));
      }

      if (typeof obj === 'object' && obj !== null && obj.constructor === Object) {
        const result: any = {};
        try {
          for (const [key, value] of Object.entries(obj)) {
            result[key] = this.serializeBigInt(value);
          }
        } catch (_e) {
          return obj;
        }
        return result;
      }

      if (obj instanceof Date) {
        return obj.toISOString();
      }

      return obj;
    } catch (_err) {
      return obj;
    }
  }
}
