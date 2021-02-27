const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const url = 'mongodb://localhost:27017/corloc';
mongoose.connect(url, { useFindAndModify: false });

const db = mongoose.connection;

db.on('error', console.error.bind(
    console, 'Connection error:'
));

db.once('open', function () {
    console.log('Connection is open...');
});

User.findOne({
    username: 'admin'
}).then(user => {
    if (user) {
        console.log('admin already created');
    } else {
        bcrypt.hash('admin', 12).then(hashedPassword => {
            User.create({
                username: 'admin',
                password: hashedPassword,
                admin: true
            }).then(user => {
                console.log('admin created');
            })
        });
    }
})

