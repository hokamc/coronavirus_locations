const mongoose = require('mongoose');

const PatientSchema = mongoose.Schema({
    caseno: Number,
    name: String,
    age: Number,
    gender: String,
    reportDate: Date
});
PatientSchema.methods.toMap = function() {
    return {
        id: this._id,
        caseno: this.caseno,
        name: this.name,
        age: this.age,
        gender: this.gender,
        reportDate: this.reportDate
    };
}
const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;