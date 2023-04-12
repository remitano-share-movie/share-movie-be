var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Connect = require('./src/database/database.js');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var filmsRouter = require('./src/routes/films')

var app = express();

Connect()
    .then(() => console.log("connect db success"))
    .catch(err => console.log("connect db failed: ", err))
Promise = global.Promise;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/films', filmsRouter)

module.exports = app;
