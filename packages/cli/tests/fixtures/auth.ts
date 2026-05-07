import { SwiftAuth } from 'swift-auth';
import { mockAdapter } from '../mocks/adapter.js';

const auth = new SwiftAuth({
   baseUrl: 'http://test.com',
   database: mockAdapter,
});

export default auth;
