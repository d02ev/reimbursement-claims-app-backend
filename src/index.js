import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import passport from 'passport'

import initServer from './config/server.config.js'
import jwtStrategy from './auth/strategy/jwt.strategy.js'
import errorHandler from './middlewares/errorHandler.middleware.js'

import authRoutes from './routes/auth.routes.js'
import claimRoutes from './routes/claim.routes.js'

import { CONNECTION_PORT } from './constants.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/claims', claimRoutes)

app.use(errorHandler)

jwtStrategy(passport)
initServer(CONNECTION_PORT, app)