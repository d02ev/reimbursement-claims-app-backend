import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import passport from 'passport';

import initServer from './config/server.config';
import jwtStrategy from './auth/strategy/jwt.strategy';
import errorHandler from './middlewares/errorHandler.middleware';

import authRoutes from './routes/auth.routes';
import claimRoutes from './routes/claim.routes';

import { CONNECTION_PORT } from './constants/app.constants';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);

app.use(errorHandler);

jwtStrategy(passport);
initServer(CONNECTION_PORT, app);
