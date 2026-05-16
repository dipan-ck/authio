import { User, Session } from './auth.js';
import { SupportedSocialProvidersType } from './provider.types.js';

export interface EmailSignUpPayload {
   name: string;
   email: string;
   password: string;
   meta?: { userAgent?: string; ipAddress?: string };
   returnVerificationToken?: boolean;
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
   returnForgotPasswordToken?: boolean;
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
   id: SupportedSocialProvidersType;
}

export interface OauthCallbackPayload {
   id: SupportedSocialProvidersType;
   code: string;
   meta?: { userAgent?: string; ipAddress?: string };
}

export interface DeleteUserPayload {
   userId: string;
}

//api return types
export type EmailSignInApiResponse = Promise<{
   user: User;
   code: string;
   message: string;
   session: Session;
}>;

export type EmailSignUpApiResponse = Promise<{
   code: string;
   message: string;
   session: Session | null;
   user: User;
   verificationToken?: string;
}>;

export type VerifyEmailApiResponse = Promise<{
   code: string;
   message: string;
   session: Session | null;
   user: User;
}>;

export type ForgetPasswordApiResponse = Promise<{
   code: string;
   message: string;
   forgotPasswordToken?: string;
}>;

export type ResetPasswordApiResponse = Promise<{ code: string; message: string }>;

export type GetSessionApiResponse = Promise<{
   user: User;
   session: Session;
   code: string;
   message: string;
}>;

export type SignoutApiResponse = Promise<{ code: string; message: string }>;

export type OauthRedirectUrlApiResponse = Promise<{ authUrl: string; state: string }>;

export type OauthCallbackApiResponse = Promise<{
   code: string;
   message: string;
   user: User;
   session: Session;
   redirectUrl: string;
}>;

export type DeleteUserApiResponse = Promise<{ code: string; message: string }>;

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
   signout: (payload: SignoutPayload) => SignoutApiResponse;
}
