import { describe, it, expect, vi, beforeEach } from 'vitest';

import { gitHubProvider } from '../../src/providers/gitHub.js';
import { SwiftAuth } from '../../src/index.js';

import { mockAdapter } from '../utils/mockAdapter.js';

const mockFetch = vi.fn();

global.fetch = mockFetch as any;

describe('gitHubProvider', () => {
   const auth = new SwiftAuth({
      baseUrl: 'http://localhost:3000',

      database: mockAdapter,

      socialProviders: {
         github: gitHubProvider({
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
            redirectUrl: 'http://localhost:3000/dashboard',
         }),
      },
   });

   const provider = auth.config.socialProviders?.github!;

   beforeEach(() => {
      vi.clearAllMocks();
   });

   it('generates correct auth URL', () => {
      const url = provider.getAuthUrl('state123', 'http://localhost:3000/callback');

      const parsed = new URL(url);

      expect(parsed.searchParams.get('client_id')).toBe('test-client-id');

      expect(parsed.searchParams.get('redirect_uri')).toBe('http://localhost:3000/callback');

      expect(parsed.searchParams.get('state')).toBe('state123');

      expect(parsed.searchParams.get('scope')).toContain('read:user');
   });

   it('exchanges code successfully', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,

         json: async () => ({
            access_token: 'token123',
            token_type: 'bearer',
            scope: 'read:user user:email',
         }),
      });

      const tokens = await provider.exchangeCode('code123', 'http://localhost:3000/callback');

      expect(tokens.accessToken).toBe('token123');

      expect(tokens.tokenType).toBe('bearer');

      expect(tokens.scope).toBe('read:user user:email');

      expect(tokens.refreshToken).toBeNull();

      expect(tokens.idToken).toBeNull();

      expect(tokens.expiresIn).toBeNull();
   });

   it('throws on token exchange http error', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: false,
         statusText: 'Unauthorized',
      });

      await expect(
         provider.exchangeCode('bad-code', 'http://localhost:3000/callback'),
      ).rejects.toThrow('GitHub token exchange failed');
   });

   it('fetches user info when email is public', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,

         json: async () => ({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            avatar_url: 'https://avatars.githubusercontent.com/u/1',
         }),
      });

      const user = await provider.getUserInfo({
         accessToken: 'token123',
         tokenType: 'Bearer',
         refreshToken: null,
         idToken: null,
         expiresIn: null,
         scope: null,
      });

      expect(user.id).toBe('1');

      expect(user.email).toBe('john@example.com');

      expect(user.name).toBe('John Doe');

      expect(user.emailVerified).toBe(true);

      expect(user.redirectUrl).toBe('http://localhost:3000/dashboard');

      expect(mockFetch).toHaveBeenCalledTimes(1);
   });

   it('fetches user email from /user/emails when email is private', async () => {
      mockFetch
         .mockResolvedValueOnce({
            ok: true,

            json: async () => ({
               id: 1,
               name: 'John Doe',
               email: null,
               avatar_url: 'https://avatars.githubusercontent.com/u/1',
            }),
         })

         .mockResolvedValueOnce({
            ok: true,

            json: async () => [
               {
                  email: 'private@example.com',
                  primary: true,
                  verified: true,
               },
            ],
         });

      const user = await provider.getUserInfo({
         accessToken: 'token123',
         tokenType: 'Bearer',
         refreshToken: null,
         idToken: null,
         expiresIn: null,
         scope: null,
      });

      expect(user.email).toBe('private@example.com');

      expect(user.redirectUrl).toBe('http://localhost:3000/dashboard');

      expect(mockFetch).toHaveBeenCalledTimes(2);
   });

   it('throws when no verified primary email found', async () => {
      mockFetch
         .mockResolvedValueOnce({
            ok: true,

            json: async () => ({
               id: 1,
               name: 'John Doe',
               email: null,
               avatar_url: 'https://avatars.githubusercontent.com/u/1',
            }),
         })

         .mockResolvedValueOnce({
            ok: true,

            json: async () => [
               {
                  email: 'john@example.com',
                  primary: false,
                  verified: false,
               },
            ],
         });

      await expect(
         provider.getUserInfo({
            accessToken: 'token123',
            tokenType: 'Bearer',
            refreshToken: null,
            idToken: null,
            expiresIn: null,
            scope: null,
         }),
      ).rejects.toThrow('No verified primary email found on this GitHub account');
   });

   it('throws when fetching user profile fails', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: false,
         statusText: 'Unauthorized',
      });

      await expect(
         provider.getUserInfo({
            accessToken: 'token123',
            tokenType: 'Bearer',
            refreshToken: null,
            idToken: null,
            expiresIn: null,
            scope: null,
         }),
      ).rejects.toThrow('Failed to fetch GitHub user');
   });

   it('throws when fetching github emails fails', async () => {
      mockFetch
         .mockResolvedValueOnce({
            ok: true,

            json: async () => ({
               id: 1,
               name: 'John Doe',
               email: null,
               avatar_url: 'https://avatars.githubusercontent.com/u/1',
            }),
         })

         .mockResolvedValueOnce({
            ok: false,
            statusText: 'Forbidden',
         });

      await expect(
         provider.getUserInfo({
            accessToken: 'token123',
            tokenType: 'Bearer',
            refreshToken: null,
            idToken: null,
            expiresIn: null,
            scope: null,
         }),
      ).rejects.toThrow('Failed to fetch GitHub user emails');
   });
});
