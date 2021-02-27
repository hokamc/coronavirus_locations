const mustAdmin = require('../helpers/must_admin');
const mustUser = require('../helpers/must_user');
const locationService = require('../services/location');

module.exports = app => {
    app.post('/locations', (req, res, next) => {
        mustAdmin(() => {
            if (Object.keys(req.body).length != 5) {
                res.status(400).json({
                    message: 'Invalid Schema'
                });
            } else {
                locationService.createLocation(
                    req.body['latitude'],
                    req.body['longitude'],
                    req.body['name'],
                    req.body['district'],
                    req.body['caseno']
                ).then(building => {
                    res.status(200).json({
                        message: 'location created'
                    });
                });
            }
        }, req, res, next);
    });

    app.get('/locations', (req, res, next) => {
        mustUser(() => {
            locationService.getAllLocations().then(buildings => {
                let js = buildings.map(b => {
                    return b.toMap();
                });
                res.status(200).json(js);
            });
        }, req, res, next);
    });

    app.delete('/locations/:id', (req, res, next) => {
        mustAdmin(() => {
            locationService.deleteLocation(req.params['id']).then(user => {
                if (!user) {
                    res.status(400).json({
                        message: 'location id not found'
                    });
                } else {
                    res.status(200).json({
                        message: 'location deleted'
                    });
                }
            });
        }, req, res, next);
    });

    app.get('/locations/:id', (req, res, next) => {
        mustUser(() => {
            locationService.getLocation(req.params['id']).then(building => {
                if (!building) {
                    res.status(400).json({
                        message: 'location id not found'
                    });
                } else {
                    res.status(200).json(building.toMap());
                }
            });
        }, req, res, next);
    });

    app.put('/locations/:id', (req, res, next) => {
        mustAdmin(() => {
            locationService.updateLocation(
                req.params['id'],
                req.body["latitude"],
                req.body["longitude"],
                req.body["name"],
                req.body["district"],
                req.body["caseno"]
            ).then(location => {
                if (!location) {
                    res.status(400).json({
                        messsage: 'No such location id'
                    });
                } else {
                    res.status(200).json({
                        message: 'location updated'
                    });
                }
            });
        }, req, res, next);
    })


}