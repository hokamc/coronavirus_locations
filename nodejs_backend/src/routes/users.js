const mustAdmin = require('../helpers/must_admin');
const userService = require('../services/user');

module.exports = app => {
    app.post('/users', (req, res, next) => {
        mustAdmin(() => {
            if (Object.keys(req.body).length != 2) {
                res.status(400).json({
                    message: 'Invalid Schema'
                });
            } else {
                userService.createUser(req.body['username'], req.body['password']).then(user => {
                    if (!user) {
                        res.status(400).json({
                            message: 'username already taken'
                        });
                    } else {
                        res.status(200).json({
                            message: 'user created'
                        });
                    }
                });
            }
        }, req, res, next);
    });

    app.get('/users', (req, res, next) => {
        mustAdmin(() => {
            userService.getUsers().then(users => {
                res.status(200).json(users.map(u => {
                    return {
                        id: u._id,
                        username: u.username
                    };
                }));
            })
        }, req, res, next);
    });

    app.put('/users/:id', (req, res, next) => {
        mustAdmin(() => {
            userService.updateUser(req.params['id'], req.body['username'], req.body['password']).then(user => {
                if (!user) {
                    res.status(400).json({
                        messsage: 'No such user id'
                    });
                } else {
                    res.status(200).json({
                        message: 'user updated'
                    });
                }
            });
        }, req, res, next);
    });

    app.delete('/users/:id', (req, res, next) => {
        mustAdmin(() => {
            userService.deleteUser(req.params['id']).then(user => {
                if (!user) {
                    res.status(400).json({
                        message: 'user id not found'
                    });
                } else {
                    res.status(200).json({
                        message: 'user deleted'
                    });
                }
            });
        }, req, res, next);
    });
}