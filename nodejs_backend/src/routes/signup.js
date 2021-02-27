const passport = require('passport');
const User = require('../models/user');

module.exports = app => {
    app.post('/signup', (req, res, next) => {
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                console.log(err);
            }
            if (info) {
                res.status(400).json({
                    message: info.message
                });
            } else {
                res.status(200).json({
                    message: 'user created'
                });
            }
        })(req, res, next);
    });
}