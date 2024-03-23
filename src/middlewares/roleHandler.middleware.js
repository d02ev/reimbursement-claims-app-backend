import UserRepository from '../repositories/user.repository';

// eslint-disable-next-line consistent-return
const roleHandler = (allowedRole) => async (req, res, next) => {
  try {
    const userRepository = new UserRepository();
    const userId = req.user.sub;
    const userDetails = await userRepository.fetchUserRoles(userId);
    const userRole = userDetails.role;

    if (userRole !== allowedRole) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Insufficient privileges',
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: 'An internal unknown error occurred while validating the privileges',
    });
  }
};

export default roleHandler;
