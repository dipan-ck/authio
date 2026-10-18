import { Authio } from '@dipan-ck/authio-core';
import { mockAdapter } from '../mocks/adapter.js';

const auth = new Authio({
   baseUrl: 'http://test.com',
   database: mockAdapter,
});

export default auth;
