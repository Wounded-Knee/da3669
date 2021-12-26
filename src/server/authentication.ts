import { auth } from './config';
import Passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cookieParser from 'cookie-parser';
import { cookieName } from './config';
import { getUserById, userCreateOrFetchByProfile } from './lib/classes/userManager';
import { getSessionById, createSession } from './lib/classes/sessionManager';

const debug = {
  auth: false,
};

// Authentication
// @ts-ignore
Passport.serializeUser((user, done) => done(null, user._id));
Passport.deserializeUser(async (_id: string, done) => done(null, await getUserById(_id)));
Passport.use(
  new GoogleStrategy(
    {
      clientID: auth.google.clientId,
      clientSecret: auth.google.clientSecret,
      callbackURL: auth.callbackUrl,
    },
    async function (token, tokenSecret, profile, done) {
      // @ts-ignore
      done(null, await userCreateOrFetchByProfile(profile));
    },
  ),
);
if (debug.auth) console.log(auth.callbackUrl);

export const setupPassport = (express) => {
  express.use(cookieParser());
  express.use(Passport.initialize());
  express.use(Passport.session());
  express.get('/google', (req, res, next) => {
    req.session.redirectTo = req.get('Referrer');
    return Passport.authenticate('google', { scope: 'profile' })(req, res, next);
  });
  express.get(auth.callbackUrlPath, function (req, res, next) {
    // @ts-ignore
    Passport.authenticate('google', { session: false }, function (err, user, info) {
      if (err) {
        console.error(err, info);
      } else {
        console.log('Browser SID: ', req.cookies[cookieName]);
        if (user) {
          if (!getSessionById(req.cookies[cookieName])) {
            const session = createSession(user._id.toString());
            console.log('Created a new session', session);
            const twoDays = 24 * 60 * 60 * 1000 * 2;
            res.cookie(cookieName, session.sessionId, {
              maxAge: twoDays,
              httpOnly: false,
              secure: false,
            });
          }
          res.redirect(req.session.redirectTo);
        } else {
          console.error('No user info returned ', user, info);
        }
      }
    })(req, res, next);
  });
};
