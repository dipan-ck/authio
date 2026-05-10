// src/errors.ts
export class AuthioError extends Error {
   constructor(
      public code: string,
      message: string,
   ) {
      super(message);
      this.name = 'AuthioError';
   }
}
