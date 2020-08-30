const express = require('express');
const router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');
const shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');
  
module.exports = function (passport) {
  router.get('/login',(request, response) => {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login'
    var list = template.list(request.list);
    var  html = template.HTML(title, list, 
      `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p>
          <input type="submit" value="login"/>
        </p>
      </form>
    `, '');
    response.send(html);
  });
  
  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true
    }));

  router.get('/register',(request, response) => {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - Resister'
    var list = template.list(request.list);
    var  html = template.HTML(title, list, 
      `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/register_process" method="post">
        <p><input type="text" name="email" placeholder="email" value="ho513@naver.com"></p>
        <p><input type="password" name="password" placeholder="password" value="1111"></p>
        <p><input type="password" name="password2" placeholder="password" value="1111"></p>
        <p><input type="text" name="displayName" placeholder="display name" value="ho513"></p>
        <p>
          <input type="submit" value="register"/>
        </p>
      </form>
    `, '');
    response.send(html);
  });
  
  router.post("/register_process", (request, response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    var password2 = post.password2;
    var displayName = post.displayName;
    if(password !== password2) {
      request.flash('error', 'Password must be the same!');
      response.redirect('/auth/register');
    } else {
      bcrypt.hash(password, 10, function (err, hash) {
        var user = {
          id:shortid.generate(),
          email:email,
          password:hash,
          displayName:displayName
        };
        db.get('users').push(user).write(); 
        request.login(user, function(err){
          return response.redirect('/');
        });
      });    
    }
  });

  router.get('/logout',(request, response) => {
    request.logout();
    // request.session.destroy( err => {response.redirect('/');})
    request.session.save(() => response.redirect('/'));
  });
  
  return router;
}