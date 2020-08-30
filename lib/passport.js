var db = require('../lib/db'); 
var bcrypt = require('bcrypt');

module.exports = function (app) {
  
  var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
    // done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
    var user = db.get('users').find({id:id}).value();
    done(null, user);
  });
  
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      var user = db.get('users').find({
                  email: email
                }).value();
      if (user) {
        bcrypt.compare(password, user.password, function(err, result) {
          if(result){
            return done(null, user, { message: `Hello~!`});
          } else {
            return done(null, false, { message: 'Incorrect information(password).' });
          }
        });
      } else {
        return done(null, false, { message: 'Incorrect information.(email)' });
      }
    }
  ));
  return passport;
}