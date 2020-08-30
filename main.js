const express = require('express');
const app = express();
const port = 3000;
var fs = require('fs');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');
const db = require('./lib/db'); 

// 정적인(static) 파일 url로 접근 가능하게 해주는 미들웨어 'public'폴더 안의 static파일 다 가능
app.use(express.static('public'));
// form data 사용 시 사용하는 미들웨어 
app.use(bodyParser.urlencoded({ extended: false}));
// 데이터 압축해서 보내고 풀기 
app.use(compression());
// 내가 만든 미들웨어, 모든 get방식만 적용할께
app.use(session({
  secret: 'working for God',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));

app.use(flash()); //flash 예제 passport hp에서 참고해봐 우선 지울께

// 자체가 함수여서 이렇게 가능
var passport = require('./lib/passport')(app);

app.get('*', function(request, response, next) {
    request.list = db.get('topics').value();
    next();
});
app.use(helmet());

var indexRouter = require('./routes/index');  
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);


// 미들웨어는 순차적으로 진행하기 때문에 다 찾아보고 없으면 404라 마지막에 두자
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
  console.error(`:::::::: ${err.stack}`);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})