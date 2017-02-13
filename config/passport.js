var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var user = mongoose.model('User');

// Configure Strategy
passport.use(new localStrategy(
    function(username, password, done) {
        user.findOne({username: username}, function (err, user) {
           if (err) { return done(err); }
           if (!user) {
               return done(null, false, { message: 'Incorrect username.'});
           }

           if (!user.validPassword(password)) {
               return done(null, false, { message: 'Incorrect password.'});
           }

           return done(null, user);
        });
    }
));
