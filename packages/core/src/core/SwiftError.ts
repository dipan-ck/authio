// src/errors.ts
export class SwiftAuthError extends Error {
   constructor(
      public code: string,
      message: string,
   ) {
      super(message);
      this.name = 'SwiftAuthError';
   }
}
