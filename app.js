require('dotenv').config(); //
const express = require('express'); // 
var app = express(); //
const bodyParser = require('body-parser'); // 

app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json({ limit: '100mb' })); // Increase payload size limit to 50MB for JSON data


const cors = require('cors'); //
app.use(cors()); //

const customEnv = require('custom-env'); //
customEnv.env(process.env.NODE_ENV, './config'); //
console.log(process.env.CONNECTION_STRING);
console.log(process.env.PORT);

const mongoose = require('mongoose'); //
mongoose.connect(process.env.CONNECTION_STRING);

app.use(express.static('public'));

// directors:
const post = require('./routes/post');
const user = require('./routes/user');
const token = require('./routes/token');

//API (uses directors):
app.use('/api/users', user);
app.use('/api/tokens', token);
app.use('/api/posts', post)


app.listen(process.env.PORT);