import { Authio } from 'authio';
import { mockAdapter } from '../mocks/adapter.js';

const auth = new Authio({
   baseUrl: 'http://test.com',
   database: mockAdapter,
});

export default auth;
