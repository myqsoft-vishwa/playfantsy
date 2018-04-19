var md5 = require('md5');
var User = require(process.cwd() + "/models/User");
var passport = require('passport');
exports.bootstrap = function(req, res, next) {

    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');

    next();

};
exports.index = function(req, res) {
    res.render('index.ejs');
};
exports.login = function(req, res) {
    res.render('login.ejs');
};
exports.signup = function(req, res) {
    res.render('signup.ejs');
};

exports.loginAction = function(req, res) {
    var condition = {
        "email": req.body.email,
        "password": md5(req.body.pass),
    }
    User.find(condition, function(err, result) {

        if (result.length > 0) {
            res.redirect("/dashbaord")
        } else {
            req.flash('error_messages', 'Invalid email or password');
            res.redirect("/login")
        }

    });

};
exports.dashbaord = function(req, res) {
    res.render('dashboard.ejs');
};
exports.singupAction = function(req, res) {
    var user = new User();
    user.password = md5(req.body.pass);
    user.name = req.body.name;
    user.email = req.body.email;
    user.save();
    req.flash('success_messages', 'Signup Successfully');
    res.redirect("/login")
};

    
