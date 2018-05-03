var md5 = require('md5');
var User = require(process.cwd() + "/models/User");
var Match = require(process.cwd() + "/models/MatchList");
var TeamPic = require(process.cwd() + "/models/TeamPic");
var Player = require(process.cwd() + "/models/Player");
var passport = require('passport');
var _ = require('underscore');
var date = require('date-and-time');
var request = require('request');
var usersession;
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
    User.findOne(condition, function(err, result) {

        if (result) {
            usersession = req.session;
            usersession.email = result.email;
            res.redirect("/dashbaord")
        } else {
            req.flash('error_messages', 'Invalid email or password');
            res.redirect("/login")
        }

    });

};
exports.dashbaord = function(req, res) {

    if (typeof gmailemail != "undefined" || gmailemail != null){
        var email = gmailemail;
        usersession = req.session;
        usersession.email = email;
    } else {
        var email = req.session.email;
    }

    var isodate = new Date();
    var datetime = date.format(isodate, 'YYYY-MM-DD');
    var condition = {
        "email": email,
    }
    User.findOne(condition, function(err, result) {
        if (result) {
            Match.find({ type: 'Twenty20', dateTimeGMT: { $gte: datetime } }).lean().exec(function(err, matchresult) {

                var counter1 = 0;
                var len = matchresult.length;
                _.each(matchresult, function(sq) {
                    var isod = new Date(sq.dateTimeGMT);
                    var datetime1 = date.format(isod, 'YYYY-MM-DD HH:mm:ss');
                    var theevent = new Date(datetime1);
                    var now = new Date();
                    var sec_num = (theevent - now) / 1000;
                    var days = Math.floor(sec_num / (3600 * 24));
                    var hours = Math.floor((sec_num - (days * (3600 * 24))) / 3600);
                    var minutes = Math.floor((sec_num - (days * (3600 * 24)) - (hours * 3600)) / 60);
                    var seconds = Math.floor(sec_num - (days * (3600 * 24)) - (hours * 3600) - (minutes * 60));

                    if (hours < 10) { hours = "0" + hours; }
                    if (minutes < 10) { minutes = "0" + minutes; }
                    if (seconds < 10) { seconds = "0" + seconds; }

                    sq.localtime = days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds';
                    TeamPic.findOne({ "name": sq.team_1 }, function(err, Tpic) {
                        if (Tpic) {
                            sq.team1pic = Tpic.pic;
                        } else {
                            sq.team1pic = '429771-t20-logo-crop.jpg';
                        }

                    });

                    TeamPic.findOne({ "name": sq.team_2 }, function(err, Tpic) {
                        if (Tpic) {
                            sq.team2pic = Tpic.pic;
                        } else {
                            sq.team2pic = '429771-t20-logo-crop.jpg';
                        }

                        if (++counter1 == len) {
                            res.render('dashboard.ejs', { data: result, matchlist: matchresult });
                        }
                    });
                });


            });


        } else {
            res.redirect("/login");
        }
    })


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
exports.logout = function(req, res) {
    usersession = req.session;
    usersession.email = null;
    req.flash('success_messages', 'You have successfully logged out');
    res.redirect("/login")
};
exports.playerlist = function(req, res) {
    var unique_id = req.params.objectId;
    /*request('http://cricapi.com/api/fantasySquad/?apikey=L5NOaQDO3mTKjDenIidps0fICyv1&unique_id=' + unique_id, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        for (var i = 0; i < body.squad.length; i++) {
            var name = body.squad[i].name;
            var playerdata = body.squad[i].players
            for (var j = 0; j < playerdata.length; j++) {
                var player = new Player();
                player.pid = playerdata[j].pid;
                player.name = playerdata[j].name;
                player.teamName = name;
                player.save();
            }
        }


    });*/

    Match.find({ unique_id: unique_id }).lean().exec(function(err, matchresult) {
        var counter1 = 0;
        var len = matchresult.length;

        _.each(matchresult, function(sq) {
            //Player.find({ "teamName": sq.team_1,"teamName": sq.team_1}, function(err, player) {
            Player.find({ $or: [{ 'teamName': sq.team_1 }, { 'teamName': sq.team_2 }] }, function(err, player) {
                sq.team1pic = player;
                if (++counter1 == len) {
                    res.render('playerlist.ejs', { matchlist: matchresult });
                }
            });


        });


    });
};
exports.playerphoto = function(req, res) {
    //Player.find({}, function(err, player) {
    Player.find({}).lean().exec(function(err, player) {
        _.each(player, function(sq) {

            request('http://cricapi.com/api/playerStats/?apikey=L5NOaQDO3mTKjDenIidps0fICyv1&pid=' + sq.pid, { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                var updateData = {
                    pic: body.imageURL
                };
                Player.findOneAndUpdate({ "pid": sq.pid }, updateData).exec();

            });



        });





    });
}