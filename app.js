require('dotenv').config()
const express = require('express');
var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());

const cors = require('cors');
app.use(cors());

const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');
console.log(process.env.CONNECTION_STRING)
console.log(process.env.PORT)

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING);

app.use(express.static('public'))

//those 2 lines will repeate with respective API:
const posts = require('./routes/post');
app.use('/posts', posts);

const users = require('./routes/user');
app.use('/api/users', users);


app.listen(process.env.PORT)