const express = require('express');
const router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');

var authData = {
  email:'ho513@naver.com',
  password:'1111',
  nickname: 'ho513',
}

router.get('/login',(request, response) => {
  var title = 'WEB - login'
  var list = template.list(request.list);
  var  html = template.HTML(title, list, 
    `
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

router.post('/login_process',(request, response) => {
  var post = request.body;
  var email = post.email;
  var password = post.password
  if (email === authData.email && password === authData.password) {
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    request.session.save(() => response.redirect(`/`));
    
  } else {
    response.send('Who?');
  }
});

router.get('/logout',(request, response) => {
  request.session.destroy( err => {response.redirect('/');
  })
});

/*
router.get('/create',(request, response) => {
  var title = 'WEB - create'
  var list = template.list(request.list);
  var  html = template.HTML(title, list, 
    `
    <form action="/topic/create_process" method="post">
      <p>
        <input type="text" name="title" placeholder="title">
      </p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit"/>
      </p>
    </form>
  `, '');
  response.send(html);
});

router.post('/create_process',(request, response) => {
  //bodyParser 적용 후
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', (error) => {
    if (error) throw error;
    console.log('The file has saved!');
    response.redirect(`/topic/${title}`);
  })
});

router.get('/update/:pageId',(request, response) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`,'utf8', function(err, description){
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.HTML(title, list, 
      `
      <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p>
          <input type="text" name="title" placeholder="title" value=${title}>
        </p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit"/>
        </p>
      </form>
      `, '');
    response.send(html);
  });
});

router.post('/update_process',(request, response) => {
  var post = request.body
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', (error) => {
      if (error) throw error;
      console.log('The file has saved!');
      response.redirect(`/topic/${title}`);
    });
  });
});


router.post('/delete_process', (request, response) => {
  var post = request.body
  var id = post.id;
  var filteredId = path.parse(id).base
  fs.unlink(`data/${filteredId}`, function(error){
    response.redirect(`/`);
  })
});

router.get('/:pageId',(request, response, next) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`,'utf8', function(err, description){
    if(err) {
      next(err);
    } else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(request.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
        ` <a href="/topic/create">create</a> 
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      response.send(html);
    }
  });
});
*/
module.exports = router;