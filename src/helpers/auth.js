import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { SALT_ROUND } from '../constants.js'

export const generateAccessToken = (payload) => {
	return jwt.sign(
		payload,
		process.env.ACCESS_TOKEN_SECRET_KEY,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
	)
}

export const generateRefreshToken = (email) => {
	return jwt.sign(
		{ email },
		process.env.REFRESH_TOKEN_SECRET_KEY,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
	)
}

export const hashPassword = async (password) => {
	return await bcryptjs.hash(
		password,
		SALT_ROUND
	)
}

export const comparePassword = async (password, passwordHash) => {
	return await bcryptjs.compare(
		password,
		passwordHash
	)
}