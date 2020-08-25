const express = require('express');
const router = express.Router();
var template = require('../lib/template');

//get = route, routing
//app.get('/', (request, response) => {res.send('Hello World!')})
router.get('/', (request, response) => {
  var title = 'Welcome'
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list, 
    `
    <h2>${title}</h2><p>${description}</p>
    <img src="/images/hello.jpg" style="width: 100%; display: block;">
    `,
    `<a href="/topic/create">create</a>`
  );
  response.send(html);
});

module.exports = router;