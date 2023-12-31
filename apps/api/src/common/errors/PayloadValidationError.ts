import { StatusCodes } from 'http-status-codes';
import { ZodIssue } from 'zod';

import { AppError, AppErrorDTO } from './AppError';

export type PayloadError = { errors: ZodIssue[]; type: 'Params' | 'Query' | 'Body' };

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
