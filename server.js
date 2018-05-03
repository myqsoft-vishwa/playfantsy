var express = require('express')
var session = require('express-session');
var bodyParser = require("body-parser");
var passport = require('passport');
var app = express();
var flash=require('express-flash');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: 'ssshhhhh', proxy: true, resave: true, saveUninitialized: true, cookie: { maxAge: 24 * 60 * 60 * 1000 } }));
app.use(flash());
var routes = require('./routes/Routes'); //importing route
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
routes(app,passport);
app.listen(process.env.PORT || 5000)
console.log('server run on port 5000')