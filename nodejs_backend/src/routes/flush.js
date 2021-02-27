const mustAdmin = require('../helpers/must_admin')
const request = require('request');
const patientService = require('../services/patient');
const locationService = require('../services/location');
const apiKey = require('../../env')

const urlPatients = 'https://api.data.gov.hk/v2/filter?q=%7B%22resource%22%3A%22http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Fenhanced_sur_covid_19_eng.csv%22%2C%22section%22%3A1%2C%22format%22%3A%22json%22%7D';
const urlBuildings = 'https://api.data.gov.hk/v2/filter?q=%7B%22resource%22%3A%22http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Fbuilding_list_eng.csv%22%2C%22section%22%3A1%2C%22format%22%3A%22json%22%7D';

module.exports = app => {
    app.get('/flush', (req, res, next) => {
        mustAdmin(() => {
            flush().then(done => {
                if (done) {
                    res.status(200).json({
                        message: 'flush done'
                    });
                } else {
                    res.status(400).json({
                        message: 'API query limited'
                    });
                }
            });
        }, req, res, next);
    });
}

async function flush() {
    const patients = await doRequest(urlPatients);
    for (let pac of patients) {
        try {
            await patientService.createPatient(
                pac['Case no.'],
                pac['Name of hospital admitted'],
                pac['Age'],
                pac['Gender'],
                toDate(pac['Report date'])
            );
        } catch (err) {
            console.log('error');
        }
    }

    const buildings = await doRequest(urlBuildings);
    let trial = 0;
    for (let bu of buildings) {
        if (trial > 10) {
            return false;
        }
        try {
            const exist = await locationService.checkExist(bu['Building name']);
            if (exist) {
                await locationService.updateLocation(
                    exist._id,
                    null,
                    null,
                    null,
                    null,
                    bu['Related probable/confirmed cases'].split(',')
                );
            } else {
                let cor = await getCor(placeUrl(bu['Building name']), trial);
                trial = cor[2];
                await locationService.createLocation(
                    cor[0],
                    cor[1],
                    bu['Building name'],
                    bu['District'],
                    bu['Related probable/confirmed cases'].split(',')
                );
            }
        } catch (err) {
            console.log('error');
        }
    }
    console.log('finish');
    return true;
}

function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request.get(url, { json: true }, (error, res, body) => {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

function toDate(str) {
    let dateArr = str.split('/');
    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
}

function placeUrl(place) {
    return 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + place + '&inputtype=textquery&fields=formatted_address,name,geometry&key=' + apiKey
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function getCor(url, trial) {
    delay = 1000;
    max_delay = 6000;

    let lat = Math.random() + 22;
    let lng = Math.random() + 114;
    while (true) {
        console.log(delay / 1000);
        let locs = await doRequest(url);
        console.log(locs);
        if (locs['status'] != 'OK') {
            if (delay > max_delay) {
                break;
            }
            await sleep(delay);
            delay += 1000;
            trial += 1;
            console.log(delay, trial);
            continue;
        }
        locs = locs['candidates'];
        if (locs.length > 0) {
            lat = locs[0]['geometry']['location']['lat'];
            lng = locs[0]['geometry']['location']['lng'];
        }
        return [lat, lng, trial];
    }
    return [lat, lng, trial];
}