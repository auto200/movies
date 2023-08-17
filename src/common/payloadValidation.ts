import { RequestHandler } from "express";
import { ZodSchema } from "zod";
import {
  PayloadError,
  PayloadValidationError,
} from "./errors/PayloadValidationError";

type PayloadSchema<TParams, TQuery, TBody> = Partial<{
  params: ZodSchema<TParams>;
  query: ZodSchema<TQuery>;
  body: ZodSchema<TBody>;
}>;

export const validator =
  <
    Params extends Record<string, unknown>,
    Query extends Record<string, unknown>,
    Body extends unknown
  >(
    schema: PayloadSchema<Params, Query, Body>
  ): RequestHandler<Params, any, Body, Query> =>
  (req, _, next) => {
    const errors: PayloadError[] = [];

    if (schema.params) {
      const parsed = schema.params.safeParse(req.params);
      if (parsed.success) {
        req.params = parsed.data;
      } else {
        errors.push({ type: "Params", errors: parsed.error });
      }
    }

    if (schema.query) {
      const parsed = schema.query.safeParse(req.query);
      if (parsed.success) {
        req.query = parsed.data;
      } else {
        errors.push({ type: "Query", errors: parsed.error });
      }
    }

    if (schema.body) {
      const parsed = schema.body.safeParse(req.body);
      if (parsed.success) {
        req.body = parsed.data;
      } else {
        errors.push({ type: "Body", errors: parsed.error });
      }
    }

    if (errors.length > 0) {
      return next(new PayloadValidationError("Invalid payload", errors));
    }

    next();
  };
