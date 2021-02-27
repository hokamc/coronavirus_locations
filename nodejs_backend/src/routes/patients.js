const mustAdmin = require('../helpers/must_admin');
const mustUser = require('../helpers/must_user');
const patientService = require('../services/patient');

module.exports = app => {
    app.post('/patients', (req, res, next) => {
        mustAdmin(() => {
            if (Object.keys(req.body).length != 5) {
                res.status(400).json({
                    message: 'Invalid Schema'
                });
            } else {
                patientService.createPatient(
                    req.body['caseno'],
                    req.body['name'],
                    req.body['age'],
                    req.body['gender'],
                    req.body['reportDate']
                ).then(patient => {
                    if (!patient) {
                        res.status(400).json({
                            message: 'caseno already exist!'
                        });
                    } else {
                        res.status(200).json({
                            message: 'patient created'
                        });
                    }
                })
            }
        }, req, res, next);
    });

    app.get('/patients', (req, res, next) => {
        mustUser(() => {
            patientService.getPatients().then(patients => {
                let js = patients.map(p => {
                    return {
                        id: p._id,
                        caseno: p.caseno,
                        name: p.name,
                        age: p.age,
                        gender: p.gender,
                        reportDate: p.reportDate
                    }
                });
                res.status(200).json(js);
            });
        }, req, res, next);
    });

    app.delete('/patients/:id', (req, res, next) => {
        mustAdmin(() => {
            patientService.deletePatient(req.params['id']).then(patient => {
                console.log(!patient);
                if (!patient) {
                    res.status(400).json({
                        messsage: 'No such patient id'
                    });
                } else {
                    res.status(200).json({
                        message: 'patient deleted'
                    });
                }
            });
        }, req, res, next);
    });

    app.put('/patients/:id', (req, res, next) => {
        mustAdmin(() => {
            patientService.updatePatient(
                req.params['id'],
                req.body["caseno"],
                req.body["name"],
                req.body["age"],
                req.body["gender"],
                req.body["reportDate"]
            ).then(patient => {
                if (!patient) {
                    res.status(400).json({
                        messsage: 'No such patient id'
                    });
                } else {
                    res.status(200).json({
                        message: 'patient updated'
                    });
                }
            });
        }, req, res, next);
    })
}