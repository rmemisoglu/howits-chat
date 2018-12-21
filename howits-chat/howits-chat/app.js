'use strict';
const debug = require('debug');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const passport = require('passport');
const redisStore = require('./helpers/redisStore');

const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const index = require('./routes/index');
const auth = require('./routes/auth');
const chat = require('./routes/chat');
const messages = require('./routes/messages');

const app = express();

//helpers
//const db = require('./helpers/db');
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true }, () => {
    console.log('MongoDB: Connected');
});


//middlewares
const isAuthenticated = require('./middleware/isAuthenticated');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
    store: redisStore,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 14*24*3600000 }
}));

//passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/auth', auth);
app.use('/chat', isAuthenticated, chat);
app.use('/messages', isAuthenticated, messages);




// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
    debug('Express server listening on port ' + server.address().port);
});

//socket.io
const socketApi = require('./src/socketApi');
const io = socketApi.io;

io.attach(server);
