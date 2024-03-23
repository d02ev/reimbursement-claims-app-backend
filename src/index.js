import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import initServer from './config/server.config';
import errorHandler from './middlewares/errorHandler.middleware';

import authRoutes from './routes/auth.routes';
import claimRoutes from './routes/claim.routes';

import { CONNECTION_PORT } from './constants/app.constants';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);

app.use(errorHandler);

initServer(CONNECTION_PORT, app);
