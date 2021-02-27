const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const userService = require('../services/user');

const jwtSecret = '.Jzx//`1aj?qSx.]K`tre)JBPr4x+Ou.;)bS8vAB/E.Yn7rs&*XsuJdgS-`nqG/';

passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            session: false
        },
        (username, password, done) => {
            try {
                userService.createUser(username, password).then(user => {
                    if (!user) {
                        return done(null, false, { message: 'username already taken' });
                    } else {
                        return done(null, user);
                    }
                });
            } catch (err) {
                done(err);
            }
        }),
);

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            session: false,
        },
        (username, password, done) => {
            try {
                User.findOne({
                    username: username
                }).then(user => {
                    if (!user) {
                        return done(null, false, { message: 'User not found' });
                    } else {
                        bcrypt.compare(password, user.password).then(res => {
                            if (res != true) {
                                return done(null, false, { message: 'Wrong passwords' });
                            } else {
                                return done(null, user);
                            }
                        });
                    }
                })
            } catch (err) {
                done(err);
            }
        }
    )
);

passport.use(
    'jwt',
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
            secretOrKey: jwtSecret
        },
        (jwt_payload, done) => {
            try {
                User.findOne({
                    username: jwt_payload.id,
                }).then(user => {
                    if (user) {
                        console.log('user found');
                        done(null, user);
                    } else {
                        done(null, false, { message: 'Unauthorized token' });
                    }
                });
            } catch (err) {
                done(err);
            }
        }
    )
);

module.exports = jwtSecret;