import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import { AppError, AppErrorDTO } from './AppError';

export type PayloadError = { type: 'Params' | 'Query' | 'Body'; errors: ZodError };

export class PayloadValidationError extends AppError {
  constructor(
    public message: string,
    private errors: PayloadError[]
  ) {
    super(message, StatusCodes.BAD_REQUEST);
  }

  public toJSON(): AppErrorDTO & { errors: PayloadError[] } {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}
