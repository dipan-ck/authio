import { describe, it, expect } from 'vitest';

import { Authio } from '../src/core/authio.js';
import type { ParsedAuthioConfig } from '../src/validator/config.validator.js';

import { mockAdapter } from './utils/mockAdapter.js';

describe('Authio Instance creation test', () => {
   it('should create an instance with default values', () => {
      const expected: ParsedAuthioConfig = {
         baseUrl: 'http://localhost:3000',

         database: mockAdapter,

         socialProviders: undefined,

         session: {
            expiry: 1000 * 60 * 60 * 24,
         },

         emailAndPassword: {
            enabled: true,
            autoSignIn: true,
            verifyEmail: false,
            minPasswordLength: 8,
            verificationTokenExpiry: 1000 * 60 * 60,
            verificationCallback: undefined,
            forgotPasswordCallback: undefined,
         },

         cookies: {
            name: 'authio_session_token',
            secure: true,
            domain: 'localhost',
            sameSite: 'lax',
         },
      };

      const auth = new Authio({
         baseUrl: 'http://localhost:3000',

         database: mockAdapter,

         emailAndPassword: {
            enabled: true,
         },
      });

      expect(auth.config).toEqual(expected);
   });

   it('should create an instance with user defined emailAndPassword values', () => {
      const verificationCallback = async () => {};

      const expected: ParsedAuthioConfig = {
         baseUrl: 'http://localhost:3000',

         database: mockAdapter,

         socialProviders: undefined,

         session: {
            expiry: 1000 * 60 * 60 * 24,
         },

         emailAndPassword: {
            enabled: true,
            autoSignIn: false,
            verifyEmail: true,
            minPasswordLength: 20,
            verificationTokenExpiry: 1000 * 60 * 60,
            verificationCallback,
            forgotPasswordCallback: undefined,
         },

         cookies: {
            name: 'authio_session_token',
            secure: true,
            domain: 'localhost',
            sameSite: 'lax',
         },
      };

      const auth = new Authio({
         baseUrl: 'http://localhost:3000',

         database: mockAdapter,

         emailAndPassword: {
            enabled: true,
            autoSignIn: false,
            verifyEmail: true,
            minPasswordLength: 20,
            verificationCallback,
         },
      });

      expect(auth.config).toEqual(expected);
   });

   it('should create an instance with user defined cookie values', () => {
      const expected: ParsedAuthioConfig = {
         baseUrl: 'https://api.example.com',

         database: mockAdapter,

         socialProviders: undefined,

         session: {
            expiry: 1000 * 60 * 60 * 24,
         },

         emailAndPassword: undefined,

         cookies: {
            name: 'my_app_session',
            secure: false,
            domain: '.example.com',
            sameSite: 'strict',
         },
      };

      const auth = new Authio({
         baseUrl: 'https://api.example.com',

         database: mockAdapter,

         cookies: {
            name: 'my_app_session',
            secure: false,
            domain: '.example.com',
            sameSite: 'strict',
         },
      });

      expect(auth.config).toEqual(expected);
   });

   it('should extract domain from baseUrl when no cookie domain is provided', () => {
      const auth = new Authio({
         baseUrl: 'https://api.example.com',

         database: mockAdapter,
      });

      expect(auth.config.cookies.domain).toBe('api.example.com');
   });

   it('should use custom session expiry when provided', () => {
      const auth = new Authio({
         baseUrl: 'http://localhost:3000',

         database: mockAdapter,

         session: {
            expiry: 1000 * 60 * 60,
         },
      });

      expect(auth.config.session.expiry).toBe(1000 * 60 * 60);
   });

   it('should use custom verificationTokenExpiry when provided', () => {
      const auth = new Authio({
         baseUrl: 'http://localhost:3000',

         database: mockAdapter,

         emailAndPassword: {
            enabled: true,
            verificationTokenExpiry: 1000 * 60 * 30,
         },
      });

      expect(auth.config.emailAndPassword?.verificationTokenExpiry).toBe(1000 * 60 * 30);
   });

   it('should throw error when verifyEmail is true but verificationCallback is not provided', () => {
      expect(() => {
         new Authio({
            baseUrl: 'http://localhost:3000',

            database: mockAdapter,

            emailAndPassword: {
               enabled: true,
               verifyEmail: true,
            },
         });
      }).toThrow('verificationCallback');
   });

   it('should throw error when database is not defined', () => {
      expect(() => {
         new Authio({
            baseUrl: 'http://localhost:3000',

            // @ts-expect-error
            database: undefined,
         });
      }).toThrow('Database adapter is not defined');
   });

   it('should throw error when baseUrl is missing', () => {
      expect(() => {
         new Authio({
            // @ts-expect-error
            baseUrl: undefined,

            database: mockAdapter,
         });
      }).toThrow('baseUrl');
   });

   it('should throw error when baseUrl is not a valid url', () => {
      expect(() => {
         new Authio({
            baseUrl: 'not-a-valid-url',

            database: mockAdapter,
         });
      }).toThrow('Invalid URL');
   });
});
