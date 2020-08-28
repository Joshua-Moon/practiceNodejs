const express = require("express");
const router = express.Router();
var template = require("../lib/template");
const { response } = require("express");

var authIsOwner = (request, response) => {
  if (request.session.is_logined) {
    return true;
  } else {
    return false;
  }
};

function authStatusUI(request, response) {
  var authStatusUI = '<a href="/auth/login">login</a>';
  if(authIsOwner(request, response)) {
    authStatusUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`
  }
  return authStatusUI;
}
//get = route, routing
//app.get('/', (request, response) => {res.send('Hello World!')})
router.get("/", (request, response) => {

  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
    <h2>${title}</h2><p>${description}</p>
    <img src="/images/hello.jpg" style="width: 100%; display: block;">
    `,
    `<a href="/topic/create">create</a>`,
    authStatusUI(request, response)
  );
  response.send(html);
});

module.exports = router;
