var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var secretCode = 'cannabisisthebestkey';
var session = require('express-session');
let flash = require('connect-flash');

var homeRouter = require('./routes/home');
var authRouter = require('./routes/auth');
var userRouter  = require('./routes/user');
var yourShopRouter = require('./routes/yourshop');
var productRouter = require('./routes/product');
var shopRouter = require('./routes/shop');
var orderRouter = require('./routes/order');

var app = express();

app.use(session({
  secret: 'cannabisisthebestsession',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge : 30 * 24 * 60 * 60 * 1000
  }
}))

app.use((req,res,next) => {
  res.locals.session = req.session;
  next()
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//app.use('/public/images/', express.static('./public/images'));

app.use('/home', homeRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/yourshop', yourShopRouter);
app.use('/product', productRouter);
app.use('/shop', shopRouter);
app.use('/yourorder', orderRouter)

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
