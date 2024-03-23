import httpError from 'http-errors';

import AuthService from '../services/auth.service';
import RegisterUserResponse from '../models/registerUserResponse.model';
import LoginUserResponse from '../models/loginUserResponse.model';
import AssetExistsError from '../errors/assetExists.error';
import AssetDoesNotExistError from '../errors/assetDoesNotExist.error';
import PasswordNoMatchError from '../errors/passwordNoMatch.error';

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const newUser = await this.authService.registerUser(req.body);

      res.status(201).json(new RegisterUserResponse(newUser));
    } catch (err) {
      if (err instanceof AssetExistsError) {
        next(httpError.BadRequest(err.message));
      } else {
        next(httpError.InternalServerError('An internal unknown error occurred'));
      }
    }
  };

  login = async (req, res, next) => {
    try {
      const accessToken = await this.authService.loginUser(req.body);

      res.status(200).json(new LoginUserResponse(accessToken));
    } catch (err) {
      if (err instanceof AssetDoesNotExistError) {
        next(httpError.NotFound(err.message));
      } else if (err instanceof PasswordNoMatchError) {
        next(httpError.Unauthorized(err.message));
      } else {
        next(httpError.InternalServerError('An internal unknown error occurred'));
      }
    }
  };
}
