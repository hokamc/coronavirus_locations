const Building = require('../models/building');
const Patient = require('../models/patient');

class LocationService {

    async checkExist(name) {
        return await Building.findOne({ name : name });
    }

    async createLocation(latitude, longitude, name, district, caseno) {
        const patients = await Patient.find({
            caseno: { $in: caseno }
        });
        console.log('create location');
        return await Building.create({
            latitude: latitude,
            longitude: longitude,
            name: name,
            district: district,
            patients: patients
        });
    }

    async getAllLocations() {
        return await Building.find().populate('patients');
    }

    async deleteLocation(id) {
        return await Building.findByIdAndDelete(id);
    }

    async getLocation(id) {
        return await Building.findById(id).populate('patients');
    }

    async updateLocation(uid, latitude, longitude, name, district, caseno) {
        const patients = await Patient.find({
            caseno: { $in: caseno }
        });
        let data = {};
        if (caseno) data['patients'] = patients;
        if (name) data['name'] = name;
        if (latitude) data['latitude'] = latitude;
        if (longitude) data['longitude'] = longitude;
        if (district) data['district'] = district;
        console.log('update location');
        return await Building.findByIdAndUpdate(uid, data);
    }

}

module.exports = new LocationService();