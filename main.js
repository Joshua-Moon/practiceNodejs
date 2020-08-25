const express = require('express');
const app = express();
const port = 3000;
var fs = require('fs');
var template = require('./lib/template');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');

// form data 사용 시 사용하는 미들웨어 
app.use(bodyParser.urlencoded({ extended: false}));
// 데이터 압축해서 보내고 풀기 
app.use(compression());
// 내가 만든 미들웨어, 모든 get방식만 적용할께
app.get('*', function(request, response, next) {
  fs.readdir('./data', (error, filelist) => {
    request.list = filelist;
    next();
  });
});

//get = route, routing
//app.get('/', (request, response) => {res.send('Hello World!')})
app.get('/', (request, response) => {
  var title = 'Welcome'
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list, 
    `<h2>${title}</h2><p>${description}</p>`,
    `<a href="/create">create</a>`
  );
  response.send(html);
});

app.get('/page/:pageId',(request, response) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`,'utf8', function(err, description){
    var title = request.params.pageId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description, {
      allowedTags:['h1']
    });
    var list = template.list(request.list);
    var html = template.HTML(sanitizedTitle, list,
      `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
      ` <a href="/create">create</a> 
        <a href="/update/${sanitizedTitle}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`
    );
    response.send(html);
  });
});

app.get('/create',(request, response) => {
  var title = 'WEB - create'
  var list = template.list(filelist);
  var  html = template.HTML(title, list, 
    `
    <form action="/create_process" method="post">
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

app.post('/create_process',(request, response) => {
  //bodyParser 적용 전
  /*
  var body = '';
  request.on('data', function(data){
    body += data; 
  });
  request.on('end', function(){
    var post = qs.parse(body); //객체화
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', (error) => {
      if (error) throw error;
      console.log('The file has saved!');
      response.redirect(`/page/${title}`);
    })
  });
  */
  //bodyParser 적용 후
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', (error) => {
    if (error) throw error;
    console.log('The file has saved!');
    response.redirect(`/page/${title}`);
  })
});

app.get('/update/:pageId',(request, response) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`,'utf8', function(err, description){
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.HTML(title, list, 
      `
      <form action="/update_process" method="post">
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

app.post('/update_process',(request, response) => {
  var post = request.body
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', (error) => {
      if (error) throw error;
      console.log('The file has saved!');
      response.redirect(`/page/${title}`);
    });
  });
});

app.post('/delete_process', (request, response) => {
  var post = request.body
  var id = post.id;
  var filteredId = path.parse(id).base
  fs.unlink(`data/${filteredId}`, function(error){
    response.redirect(`/`);
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})