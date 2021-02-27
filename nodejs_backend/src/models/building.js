const mongoose = require('mongoose');

const BuildingSchema = mongoose.Schema({
    latitude: Number,
    longitude: Number,
    name: String,
    district: String,
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
});
BuildingSchema.methods.toMap = function() {
    return {
        id: this._id,
        latitude: this.latitude,
        longitude: this.longitude,
        name: this.name,
        district: this.district,
        patients: this.patients.map(p => {
            return p.toMap();
        })
    }
}
const Building = mongoose.model('Building', BuildingSchema);

module.exports = Building;