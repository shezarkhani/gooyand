
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , LinkProvider = require('./LinkProvider').LinkProvider
  , LINK_TYPES = require('./LinkProvider').LINK_TYPES;

var app = express()
  , linkProvider = new LinkProvider('localhost', 27017)
  ;


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  linkProvider.findAllSortedByType(function(err, links) {
    if(err)
      console.log(err);

    res.render('index', {
      links: links
    });
  });
});

app.post('/click', function(req, res) {
  var id = req.body.id
    , ip = req.headers['X-Forwarded-For'];

  linkProvider.addClick(id, ip, function(err) {

    res.send({});
  });
});

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});