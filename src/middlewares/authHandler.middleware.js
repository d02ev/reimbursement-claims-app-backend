import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants/app.constants';

const authHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Unauthorized access',
    });
  }
  const accessToken = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    return next();
  } catch (err) {
    if (err.name === jwt.TokenExpiredError.name) {
      return res.status(401).json({
        statusCode: 401,
        message: 'The access token has expirted',
      });
    } if (err.name === jwt.JsonWebTokenError.name) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid token',
      });
    }

    return res.status(401).json({
      statusCode: 401,
      message: 'An unknown internal error occurred while authenticating the user',
    });
  }
};

export default authHandler;
