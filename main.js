const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var template = require('./lib/template');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');

//get = route, routing
//app.get('/', (request, response) => {res.send('Hello World!')})
app.get('/', (request, response) => {
  fs.readdir('./data', (error, filelist) => {
    var title = 'Welcome'
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list, 
      `<h2>${title}</h2><p>${description}</p>`,
      `<a href="/create">create</a>`
    );
    response.send(html);
  });
});

app.get('/page/:pageId',(request, response) => {
  fs.readdir('./data', (error, filelist) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`,'utf8', function(err, description){
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(filelist);
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
});

app.get('/create',(request, response) => {
  fs.readdir('./data', (error, filelist) => {
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
});

app.post('/create_process',(request, response) => {
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
});

app.get('/update/:pageId',(request, response) => {
  fs.readdir('./data', (error, filelist) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`,'utf8', function(err, description){
      var title = request.params.pageId;
      var list = template.list(filelist);
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
});

app.post('/update_process',(request, response) => {
  var body = '';
  request.on('data', function(data){
    body += data; 
  });
  request.on('end', function(){
    var post = qs.parse(body); //객체화
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
});

app.post('/delete_process', (request, response) => {
  var body = '';
  request.on('data', function(data){
    body += data; 
  });
  request.on('end', function(){
    var post = qs.parse(body); //객체화
    var id = post.id;
    var filteredId = path.parse(id).base
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect(`/`);
    })
  });
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
/*
var http = require('http');
var url = require('url');


var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  //// {id: 'HTML'} 객체 형태로 가져온다.
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      
      })
    } else {

    }
  } else if(pathname === '/create') {

  } else if(pathname === '/create_process') {
    
  } else if (pathname === '/update') {
    
  } else if(pathname === '/update_process') {
    
  } else if(pathname === '/delete_process') {

  } else {

    response.writeHead(404);
    response.end('Not found');
  }
  


 
});
app.listen(3000); */