const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const db = require('../db');

const credentialsGoogle = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback',
  proxy: true
};

const callbackStrategyGoogle = async (accessToken, refreshToken, profile, done) => {
  const existingUser = await db.query(`SELECT * from auth WHERE email = '${profile.emails[0].value}'`);
  if(existingUser.rows.length >= 1) {
    done(null, existingUser.rows[0]);
    return;
  };
  const user = await db.query(`INSERT INTO auth (email) VALUES ('${profile.emails[0].value}')`);
  done(null, user.rows[0]);
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const getUserData = (await db.query(`SELECT * from auth WHERE id='${id}'`)).rows[0];

  done(null, getUserData)
});

passport.use(new GoogleStrategy(credentialsGoogle, callbackStrategyGoogle));