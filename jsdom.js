var restify = require('restify');
var jsdom = require('jsdom');
var uri = 'http://www.google.com';
var jqueyUri = 'http://code.jquery.com/jquery-1.5.min.js';

var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.fullResponse());

server.get('/page', function (req, res, next) {
  var url = req.params.url;

  fetchPage(url, function(err, $) {
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send({
      html: $('html').html()
    });
  });
});

server.listen(8080, function () {
  // console.log('%s listening at %s', server.name, server.url);
});

function fetchPage(url, callback) {
  jsdom.env(url, [jqueyUri], function(err, window) {
    callback(err, window.$)
  });  
}