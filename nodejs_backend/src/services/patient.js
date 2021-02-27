const Patient = require('../models/patient');

class PatientService {

    async createPatient(caseno, name, age, gender, reportDate) {
        const exist = await Patient.findOne({ caseno: caseno });
        if (!exist) {
            console.log('create patient');
            return await Patient.create({
                caseno: caseno,
                name: name,
                age: age,
                gender: gender,
                reportDate: reportDate
            });
        } else {
            return await this.updatePatient(exist._id, caseno, name, age, gender, reportDate);
        }
    }

    async getPatients() {
        return await Patient.find();
    }

    async deletePatient(uid) {
        return await Patient.findByIdAndDelete(uid);
    }

    async updatePatient(uid, caseno, name, age, gender, reportDate) {
        let data = {};
        if (caseno) data['caseno'] = caseno;
        if (name) data['name'] = name;
        if (age) data['age'] = age;
        if (gender) data['gender'] = gender;
        if (reportDate) data['reportDate'] = new Date(reportDate);
        return await Patient.findByIdAndUpdate(uid, data);
    }
}

module.exports = new PatientService();