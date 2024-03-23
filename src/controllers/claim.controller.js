import httpError from 'http-errors';
import logger from '../utils/logger';
import ClaimService from '../services/claim.service';
import ClaimCreationResponse from '../models/claimCreationResponse.model';
import FileUploadError from '../errors/fileUpload.error';
import ClaimRetrievalResponse from '../models/claimRetrievalResponse.model';

export default class ClaimController {
  constructor() {
    this.claimService = new ClaimService();
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
        userId: req.user.sub,
      };
      const newClaim = await this.claimService.createClaim(claimCreationData);

      res.status(201).json(new ClaimCreationResponse(newClaim));
    } catch (err) {
      if (err instanceof FileUploadError) {
        next(httpError.BadRequest(err.message));
      }

      logger.error(err.message, {
        errorMetadata: {
          requestInfo: JSON.stringify(req.body),
          error: err,
          errorCode: err.errorCode,
        },
      });
      next(httpError.InternalServerError('An internal unknown error occurred'));
    }
  };

  retrieveAllClaimsInProcess = async (req, res, next) => {
    try {
      const claimsInProcess = await this.claimService.getAllClaimsInProcess();

      res.status(200).json(new ClaimRetrievalResponse(claimsInProcess));
    } catch (err) {
      logger.error(err.message, {
        errorMetadata: {
          requestInfo: JSON.stringify(req.body),
          error: err,
          errorCode: err.errorCode,
        },
      });
      next(httpError.InternalServerError('An internal unknown error occurred'));
    }
  };

  retrieveAllApprovedClaims = async (req, res, next) => {
    try {
      const approvedClaims = await this.claimService.getAllApprovedClaims();

      res.status(200).json(new ClaimRetrievalResponse(approvedClaims));
    } catch (err) {
      logger.error(err.message, {
        errorMetadata: {
          requestInfo: JSON.stringify(req.body),
          error: err,
          errorCode: err.errorCode,
        },
      });
      next(httpError.InternalServerError('An internal unknown error occurred'));
    }
  };

  retrieveAllDeclinedClaims = async (req, res, next) => {
    try {
      const declinedClaims = await this.claimService.getAllDeclinedClaims();

      res.status(200).json(new ClaimRetrievalResponse(declinedClaims));
    } catch (err) {
      logger.error(err.message, {
        errorMetadata: {
          requestInfo: JSON.stringify(req.body),
          error: err,
          errorCode: err.errorCode,
        },
      });
      next(httpError.InternalServerError('An internal unknown error occurred'));
    }
  };
}
