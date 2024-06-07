/* global __dirname */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const logger = require('morgan');
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require("./models/user");

const MongoStore = require('connect-mongo');

// Установим подключение по умолчанию
const mongoDB = "mongodb://localhost:27017/navigator";
mongoose.connect(mongoDB);
// Позволим Mongoose использовать глобальную библиотеку промисов
mongoose.Promise = global.Promise;
// Получение подключения по умолчанию
const db = mongoose.connection;

// Привязать подключение к событию ошибки  (получать сообщения об ошибках подключения)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var navigatorRouter = require('./routes/navigator');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongoUrl: db.client.s.url })
}));

const strategy = new LocalStrategy(User.authenticate());
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/navigator', navigatorRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
