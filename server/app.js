var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var express = require('express');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var messageRouter = require('./routes/message');

var app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}
));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const { connection } = require('./database/db');

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1); // Exit the process if the connection fails
  }
  console.log('Connected to the database.');
});


app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret key
  resave: false,            // Avoid resaving unmodified sessions
  saveUninitialized: true,  // Save new sessions that are unmodified
  cookie: { secure: false, maxAge: 1000 * 60 * 60 } // Secure: true for HTTPS, set session expiry
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/message', messageRouter);





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

// const port = 5000

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`)
// })

module.exports = app;
