import { Router } from 'express';
import fileUpload from '../middlewares/fileUpload.middleware';
import ClaimController from '../controllers/claim.controller';
import authHandler from '../middlewares/authHandler.middleware';
import roleHandler from '../middlewares/roleHandler.middleware';
import { ROLES } from '../constants/app.constants';

const claimController = new ClaimController();
const claimRoutes = Router();

claimRoutes
  .route('/')
  .post(
    authHandler,
    fileUpload,
    claimController.generateClaimRecord,
  );
claimRoutes
  .route('/in-process')
  .get(
    authHandler,
    roleHandler(ROLES.APPROVER),
    claimController.retrieveAllClaimsInProcess,
  );
claimRoutes
  .route('/approved')
  .get(
    authHandler,
    roleHandler(ROLES.APPROVER),
    claimController.retrieveAllApprovedClaims,
  );
claimRoutes
  .route('/declined')
  .get(
    authHandler,
    roleHandler(ROLES.APPROVER),
    claimController.retrieveAllDeclinedClaims,
  );

export default claimRoutes;
