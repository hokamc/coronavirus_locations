const User = require('../models/user');
const bcrypt = require('bcrypt');

class UserService {

    constructor() { }

    async createUser(username, password) {
        const user = await User.findOne({ username: username });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 12);
            return await User.create({
                username: username,
                password: hashedPassword,
                admin: false
            });
        }
    }

    async deleteUser(uid) {
        return await User.findByIdAndDelete(uid);
    }

    async updateUser(uid, username, password) {
        let data = {};
        if (username) data['username'] = username;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            data['password'] = hashedPassword;
        }
        return await User.findByIdAndUpdate(uid, data);
    }

    async getUsers() {
        return await User.find({ admin : false});
    }

    async getUser(uid) {
        return await User.findById(uid);
    }

}

module.exports = new UserService();