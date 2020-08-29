module.exports = function (app) {

  var authData = {
    email:'ho513@naver.com',
    password:'1111',
    nickname: 'ho513',
  }
  
  var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function(user, done) {
    done(null, user.email);
    // done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    done(null, authData);
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
  });
  
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      if (username === authData.email) {
        if(password === authData.password){
          return done(null, authData, { message: `Hello~!`});
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
      } else {
        return done(null, false, { message: 'Incorrect username.' });
      }
    }
  ));
  return passport;
}