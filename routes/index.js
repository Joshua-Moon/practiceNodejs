const express = require("express");
const router = express.Router();
const template = require("../lib/template");
const auth = require("../lib/auth");


router.get("/", (request, response) => {
  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.success) {
    feedback = fmsg.success[0];
  }

  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
    <div style="color:green;">${feedback}</div>
    <h2>${title}</h2><p>${description}</p>
    <img src="/images/coding.jpg" style="width: 100%; display: block;">
    `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response)
  );
  response.send(html);
});

module.exports = router;
