var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./auth');
var User = require(process.cwd() + "/models/User");
var md5 = require('md5');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        done(null, id);
    });
    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {

                User.findOne({"email":profile.emails[0].value}, function(err, result) {
                    if (result) {
                        global.gmailemail = profile.emails[0].value;
                    } else {
                        var user = new User();
                        user.password = md5(profile.id);
                        user.name = profile.displayName;
                        user.email = profile.emails[0].value;
                        user.save();
                        global.gmailemail = profile.emails[0].value;
                    }
                });


                return done(null, profile);
            });
        }

    ));





};