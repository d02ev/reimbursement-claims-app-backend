import { Router } from 'express'
import passport from 'passport'
import { fileUpload } from '../middlewares/fileUpload.middleware.js'
import ClaimController from '../controllers/claim.controller.js'

const claimController = new ClaimController()
const claimRoutes = Router()

claimRoutes.route('/').post(passport.authenticate('jwt', { session: false }), fileUpload, claimController.generateClaimRecord)

export default claimRoutes