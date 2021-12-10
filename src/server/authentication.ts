import { auth } from './config';
import Passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

const debug = {
  auth: true,
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
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });

      userData.profile = profile;
      if (debug.auth) console.log('GOOGLE: ', token, tokenSecret, profile);
      done(null, profile);
    },
  ),
);
if (debug.auth) console.log(auth.callbackUrl);

export const setupPassport = (express) => {
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
