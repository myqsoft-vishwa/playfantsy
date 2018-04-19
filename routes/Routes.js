'use strict';
module.exports = function(app, passport) {
    var homeControllers = require(process.cwd() + '/controllers/homeController');
    var adminControllers = require(process.cwd() + '/controllers/adminController');
    /*--------------------------admin rout---------------------*/
    app.route('/')
        .get(homeControllers.index);
    app.route('/login')
        .get(homeControllers.bootstrap, homeControllers.login);
    app.route('/loginAction')
        .post(homeControllers.loginAction);
    app.route('/dashbaord')
        .get(homeControllers.dashbaord);
    app.route('/signup')
        .get(homeControllers.signup);
    app.route('/singupAction')
        .post(homeControllers.singupAction);
    /*-----------------------------------adminpanel-----------------------------*/
    app.route('/admin')
        .get(adminControllers.bootstrap, adminControllers.login);
    app.route('/admin_login')
        .post(adminControllers.admin_login);
    app.route('/admin/dashbaord')
        .get(adminControllers.dashbaord);
    app.route('/admin/logout')
        .get(adminControllers.logout);
    /*---------------------------social login---------------------------------------*/
    app.route('/googlelogin')
        .get(passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.route('/googlecallback')
        .get(passport.authenticate('google', {
            successRedirect: '/dashbaord',
            failureRedirect: '/'
        }));

};