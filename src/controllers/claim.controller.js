import httpError from 'http-errors'

import ClaimService from '../services/claim.service.js'
import ClaimCreationResponse from '../models/claimCreationResponse.model.js'
import logger from '../utils/logger.js'
import { FileUploadError } from '../errors/fileUpload.error.js'

export default class ClaimController {
	constructor() {
		this.claimService = new ClaimService()
	}

	generateClaimRecord = async (req, res, next) => {
		try {
			const claimCreationData = {
				date: req.body.date,
				requestedAmt: req.body.requestedAmt,
				currency: req.body.currency,
				claimType: req.body.claimType,
				fileName: req.file.originalname,
				fileBuffer: req.file.buffer,
				mimeType: req.file.mimetype,
				userId: req.user.id
			}
			const newClaim = await this.claimService.createClaim(claimCreationData)
			
			res.status(201).json(new ClaimCreationResponse(201, 'Claim created successfully', newClaim))
		} catch (err) {
			if (err instanceof FileUploadError) {
				next(httpError.BadRequest(err.message))
			}

			logger.error(err.message, { errorMetadata: { requestInfo: JSON.stringify(req.body), err, errorCode: err.errorCode } })
			next(httpError.InternalServerError('An internal unknown error occurred'))
		}
	}
}