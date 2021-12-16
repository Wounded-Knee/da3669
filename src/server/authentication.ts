import { auth } from './config';
import Passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getNodeTypeByName, defaultNodeType } from '../shared/nodes/all';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import { cookieName } from './config';
import { ISession } from '../shared/all';

const debug = {
  auth: false,
};

// Authentication
Passport.serializeUser((user, done) => {
  // @ts-ignore
  done(null, user._id);
});

Passport.deserializeUser((_id, done) => {
  const UserModel = getNodeTypeByName('User').model;
  UserModel.findById(_id, (err, userNode) => {
    if (!err) {
      done(null, userNode);
    } else {
      done(err);
    }
  });
});

Passport.use(
  new GoogleStrategy(
    {
      clientID: auth.google.clientId,
      clientSecret: auth.google.clientSecret,
      callbackURL: auth.callbackUrl,
    },
    function (token, tokenSecret, profile, done) {
      const UserModel = getNodeTypeByName('User').model;
      const query = { $and: [{ googleId: profile.id }, { googleId: { $ne: '' } }] };
      UserModel.findOne(query, (err, userNode) => {
        if (!err && userNode) {
          // Found
          if (debug.auth) console.log('Found user: ', userNode);
          done(null, userNode);
        } else {
          // Create
          if (debug.auth) console.log('Creating user');
          new UserModel({
            name: profile.displayName,
            pictureUrl: profile.photos[0].value,
            googleId: profile.id,
          })
            .save()
            .then((userNode) => {
              this.log('Created New User', userNode);
              done(null, userNode);
            })
            .catch((e) => done(e));
        }
      });
    },
  ),
);
if (debug.auth) console.log(auth.callbackUrl);

const sessions = [];

export const getSessionById = (sessionId): ISession => sessions.find(({ id }) => id === sessionId) || {};

export const setupPassport = (express) => {
  express.use(cookieParser());
  express.use(Passport.initialize());
  express.use(Passport.session());
  express.get('/google', Passport.authenticate('google', { scope: 'profile' }));
  express.get('/google/loginCallback', Passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const sessionId = req.cookies[cookieName];
    const { userId } = getSessionById(sessionId);
    if (!sessionId || !userId) {
      // Create Session
      const session = <ISession>{
        id: uuidv4(),
        userId: req.user._id,
        date: new Date(),
      };
      sessions.push(session);
      const twoDays = 24 * 60 * 60 * 1000 * 2;
      res.cookie(cookieName, session.id, {
        maxAge: twoDays,
        httpOnly: false,
        secure: false,
      });
    }
    res.redirect('/talk/');
  });
};
