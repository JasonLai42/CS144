var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* DATABASE */
var client = require('./db');

/* ROUTERS */
var indexRouter = require('./routes/index');
// blog router
var blogRouter = require('./routes/blog');
// login router
var loginRouter = require('./routes/login');
// authentication
var auth = require('./auth');
// rest api router
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ROUTES */
app.use('/', indexRouter);
app.use('/blog', blogRouter);
app.use('/login', loginRouter);
app.use('/api', auth);
app.use('/api', apiRouter);

/* MongoDB CONNECTION */
client.connect('mongodb://localhost:27017/', (err) => {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    }
});

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
