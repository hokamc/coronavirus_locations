const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    admin: Boolean
});
const User = mongoose.model('User', UserSchema);

module.exports = User;