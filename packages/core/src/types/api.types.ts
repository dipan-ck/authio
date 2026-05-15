import { ApiErrorResponse } from './authioError.types.js';
import { User, Session } from './auth.js';

export interface EmailSignUpPayload {
   name: string;
   email: string;
   password: string;
   meta?: { userAgent?: string; ipAddress?: string };
}

export interface EmailSignInPayload {
   email: string;
   password: string;
   meta?: { userAgent?: string; ipAddress?: string };
}

export interface VerifyEmailPayload {
   token: string;
}

export interface ForgetPasswordPayload {
   email: string;
}

export interface ResetPasswordPayload {
   token: string;
   newPassword: string;
}

export interface GetSessionPayload {
   token: string;
}

export interface SignoutPayload {
   token: string;
}

export interface OauthRedirectUrlPayload {
   id: 'google' | 'github';
}

export interface OauthCallbackPayload {
   id: 'google' | 'github';
   code: string;
   meta?: { userAgent?: string; ipAddress?: string };
}

export interface DeleteUserPayload {
   userId: string;
}

//api return types
export type EmailSignInApiResponse = Promise<
   ApiErrorResponse | { user: User; code: string; message: string; session: Session }
>;

export type EmailSignUpApiResponse = Promise<
   ApiErrorResponse | { code: string; message: string; session: Session | null; user: User }
>;

export type VerifyEmailApiResponse = Promise<
   ApiErrorResponse | { code: string; message: string; session: Session | null; user: User }
>;

export type ForgetPasswordApiResponse = Promise<
   ApiErrorResponse | { code: string; message: string }
>;

export type ResetPasswordApiResponse = Promise<
   ApiErrorResponse | { code: string; message: string }
>;

export type GetSessionApiResponse = Promise<
   ApiErrorResponse | { user: User; session: Session; code: string; message: string }
>;

export type SignoutApiResponse = Promise<ApiErrorResponse | { code: string; message: string }>;

export type OauthRedirectUrlApiResponse = Promise<
   ApiErrorResponse | { authUrl: string; state: string }
>;

export type OauthCallbackApiResponse = Promise<
   | ApiErrorResponse
   | {
        code: string;
        message: string;
        user: User;
        session: Session;
        redirectUrl: string;
     }
>;

export type DeleteUserApiResponse = Promise<ApiErrorResponse | { code: string; message: string }>;

export interface ApiInterface {
   emailSignUp: (payload: EmailSignUpPayload) => EmailSignUpApiResponse;
   emailSignIn: (payload: EmailSignInPayload) => EmailSignInApiResponse;
   getSession: (payload: GetSessionPayload) => GetSessionApiResponse;
   verifyEmail: (payload: VerifyEmailPayload) => VerifyEmailApiResponse;
   forgotPassword: (payload: ForgetPasswordPayload) => ForgetPasswordApiResponse;
   resetPassword: (payload: ResetPasswordPayload) => ResetPasswordApiResponse;
   oauthRedirectUrl: (payload: OauthRedirectUrlPayload) => OauthRedirectUrlApiResponse;
   oauthCallback: (payload: OauthCallbackPayload) => OauthCallbackApiResponse;
   deleteUser: (payload: DeleteUserPayload) => DeleteUserApiResponse;
}
