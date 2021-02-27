const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/passport');

module.exports = app => {
    app.post('/login', (req, res, next) => {
        passport.authenticate('login', (err, user, info) => {
            if (err) {
                console.log(err);
            }
            if (info) {
                res.status(401).json({
                    message: info.message
                });
            } else {
                const token = jwt.sign({ id: user.username }, jwtSecret, { expiresIn: '1d' });
                res.status(200).json({
                    token: token,
                    message: 'user logged in'
                });
            }
        })(req, res, next);
    });
}