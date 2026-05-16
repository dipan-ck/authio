import { AuthioError } from '@authio/core';
import { Response } from 'express';

export function sendError(res: Response, err: unknown) {
   console.error(err);
   if (err instanceof AuthioError) {
      return res.status(400).json({
         code: err.code,
         error: err.message,
      });
   }
   return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      error: 'Something went wrong',
   });
}
