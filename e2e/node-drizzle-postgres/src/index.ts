import 'dotenv/config.js';
import express from 'express';
// import { toNodeHandler } from '@authio/node';
// import cookieParser from 'cookie-parser';
// import auth from './lib/auth.js';
import { setupNodeServer } from './setupServer.js';

const app: ReturnType<typeof express> = express();
const s = setupNodeServer({ provider: 'postgres', database: 'drizzle' });
s.spinUp();
s.tearDown();
// app.use(express.json);
// app.use(cookieParser());
// app.use(toNodeHandler(auth));
// app.get('/', (req, res) => {
//    res.send('node-drizzle-postgres testing app');
// });
//
export default app;
