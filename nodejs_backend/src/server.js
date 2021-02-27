const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();

require('./config/mongodb');
require('./config/passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

require('./routes/signup')(app);
require('./routes/login')(app);
require('./routes/patients')(app);
require('./routes/locations')(app);
require('./routes/users')(app);
require('./routes/flush')(app);

app.listen('3000', () => console.log('Listening on port 3000'));

module.exports = app;
