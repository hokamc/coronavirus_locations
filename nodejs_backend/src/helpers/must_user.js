const passport = require('passport');

module.exports = (callback, req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info) {
            res.status(403).json({
                message: info.message
            });
        } else {
            callback();
        }
    })(req, res, next);
}