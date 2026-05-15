export interface ApiErrorResponse extends Error {
   code: string;
   message: string;
}
