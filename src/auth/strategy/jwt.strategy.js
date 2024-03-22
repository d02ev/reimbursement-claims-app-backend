import { Strategy, ExtractJwt } from 'passport-jwt';
import UserRepository from '../../repositories/user.repository';

const userRepository = new UserRepository();

export default function jwtStrategy(passport) {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
      },
      (jwtPayload, done) => {
        userRepository
          .fetchById(parseInt(jwtPayload.sub, 10))
          .then((user) => done(null, user))
          .catch((err) => done(err, false));
      },
    ),
  );
}
