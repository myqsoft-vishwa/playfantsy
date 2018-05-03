var md5 = require('md5');
var Admin = require(process.cwd() + "/models/Admin");
var Category = require(process.cwd() + "/models/Category");
var Match = require(process.cwd() + "/models/MatchList");
var TeamPic = require(process.cwd() + "/models/TeamPic");
var Player = require(process.cwd() + "/models/Player");
var request = require('request');
var _ = require('underscore');
var date = require('date-and-time');

var adminsession;
exports.bootstrap = function(req, res, next) {

    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.username = req.session.username;
     if (req.session.username == undefined) {
        res.render('admin/index.ejs');
    }else {
        next();    
    }
    

};
exports.login = function(req, res) {
    res.render('admin/index.ejs');
};
exports.admin_login = function(req, res) {
    var condition = {
        "username": req.body.username,
        "password": md5(req.body.password),
    }

    Admin.findOne(condition, function(err, result) {
        if (result) {
            adminsession = req.session;
            adminsession.username = result.username;
            res.redirect("/admin/dashbaord")
        } else {
            req.flash('error_messages', 'Invalid email or password');
            res.redirect("/admin")
        }
    });
};
exports.dashbaord = function(req, res) {

    adminsession = req.session;
    var username = adminsession.username;
    if (adminsession.username == undefined) {
        res.redirect("/admin");
    } else {
        var condition = {
            "username": username,
        }
        Admin.findOne(condition, function(err, result) {

        });
        res.render('admin/dashbaord.ejs');
    }



};
exports.logout = function(req, res) {

    adminsession = req.session;
    adminsession.username = null;
    req.flash('success_messages', 'You have successfully logged out');
    res.redirect("/admin")
};
exports.category = function(req, res) {
    Category.find(function(err, result) {
        res.render('admin/category.ejs', { data: result });
    });

};
exports.delete_category = function(req, res) {
    var id = req.params.objectId;
    var query = Category.remove({ _id: id }).exec();
    req.flash('success_messages', 'Category has been deleted successfully');
    res.redirect("/admin/category")
};
exports.addCategory = function(req, res) {
    res.render('admin/addCategory.ejs');
};
exports.add_category = function(req, res) {
    var categorydata = new Category();
    categorydata.name = req.body.categoryName;
    categorydata.save();
    req.flash('success_messages', 'Category has been added successfully');
    res.redirect("/admin/category")
};
exports.matchlist = function(req, res) {
    /*request('http://cricapi.com/api/matches/?apikey=L5NOaQDO3mTKjDenIidps0fICyv1', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        for (var i = 0; i < body.matches.length; i++) {

            var matchdata = new Match();
            matchdata.unique_id = body.matches[i].unique_id;
            matchdata.team_2 = body.matches[i]['team-2'];
            matchdata.team_1 = body.matches[i]['team-1'];
            matchdata.type = body.matches[i].type;
            matchdata.date = body.matches[i].date;
            matchdata.dateTimeGMT = body.matches[i].dateTimeGMT;
            matchdata.squad = body.matches[i].squad;
            matchdata.matchStarted = body.matches[i].matchStarted;
            matchdata.save();

        }
    });*/

};
exports.listmatch = function(req, res) {
    //Match.find(function(err, result) {
    Match.find({}).lean().exec(function(err, result) {
        var counter1 = 0;
        var len = result.length;
        _.each(result, function(sq) {
            var isod = new Date(sq.dateTimeGMT);
            var datetime1 = date.format(isod, 'YYYY-MM-DD HH:mm:ss');
            sq.localtime = datetime1;
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
                    sq.team1pic = '429771-t20-logo-crop.jpg';
                }
                if (++counter1 == len) {
                    res.render('admin/match.ejs', { data: result });
                }

            });
        });

    });
};
exports.teampic = function(req, res) {
    TeamPic.find({}, function(err, result) {
        console.log(result)
        res.render('admin/teampic.ejs', { data: result });
    });
};
exports.playerlist = function(req, res) {
    Player.find({}, function(err, result) {
        res.render('admin/playerlist.ejs', { data: result });
    });
};