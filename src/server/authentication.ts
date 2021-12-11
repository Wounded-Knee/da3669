import { auth } from './config';
import Passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { getNodeTypeByName, defaultNodeType } from '../shared/nodes/all';

const debug = {
  auth: false,
};

// Authentication
Passport.serializeUser((user, done) => {
  done(null, user.id);
});

Passport.deserializeUser((user, done) => {
  done(null, user);
});

const userData = {
  profile: {
    _json: {},
  },
};
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
      console.log('Query ', query);
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
            .then((userNode) => done(null, userNode))
            .catch((e) => done(e));
        }
      });
    },
  ),
);
if (debug.auth) console.log(auth.callbackUrl);

export const setupPassport = (d3Server) => {
  const { express } = d3Server;
  express.use(Passport.initialize());
  express.get('/google', Passport.authenticate('google', { scope: 'profile' }));
  express.get('/google/loginCallback', Passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    if (userData.profile._json) {
      if (debug.auth) console.log('Storing cookie ', userData);
      const oneDayToSeconds = 24 * 60 * 60;
      res.cookie('userProfile', JSON.stringify(userData.profile._json), {
        maxAge: oneDayToSeconds,
        httpOnly: false,
        secure: false,
      });
    } else {
      if (debug.auth) console.log('No cookie for you');
    }

    res.redirect('/successfulLogin');
  });
};
