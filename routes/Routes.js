'use strict';
module.exports = function(app, passport) {
    var homeControllers = require(process.cwd() + '/controllers/homeController');
    var adminControllers = require(process.cwd() + '/controllers/adminController');




    /*--------------------------fornt rout---------------------*/
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
    app.route('/logout')
        .get(homeControllers.logout);
    app.route('/playerlist/:objectId')
        .get(homeControllers.playerlist);
    app.route('/playerphoto')
        .get(homeControllers.playerphoto);
    /*-----------------------------------adminpanel-----------------------------*/





    app.route('/admin')
        .get(adminControllers.bootstrap, adminControllers.login);
    app.route('/admin_login')
        .post(adminControllers.admin_login);
    app.route('/admin/dashbaord')
        .get(adminControllers.bootstrap, adminControllers.dashbaord);
    app.route('/admin/logout')
        .get(adminControllers.logout);
    app.route('/admin/category')
        .get(adminControllers.bootstrap, adminControllers.category);
    app.route('/admin/delete_category/:objectId')
        .get(adminControllers.bootstrap, adminControllers.delete_category);
    app.route('/admin/addCategory')
        .get(adminControllers.bootstrap, adminControllers.addCategory);
    app.route('/admin/add_category')
        .post(adminControllers.add_category);
    app.route('/admin/matchlist')
        .get(adminControllers.matchlist);
    app.route('/admin/listmatch')
        .get(adminControllers.listmatch);
    app.route('/admin/teampic')
        .get(adminControllers.teampic);
    app.route('/admin/playerlist')
        .get(adminControllers.bootstrap,adminControllers.playerlist);






    /*---------------------------social login---------------------------------------*/
    app.route('/googlelogin')
        .get(passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.route('/googlecallback')
        .get(passport.authenticate('google', {
            successRedirect: '/dashbaord',
            failureRedirect: '/login'
        }));

};