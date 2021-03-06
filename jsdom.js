var iconv = require('iconv-lite');
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
    res.send({
      html: $('html').html()
    });
  });
});

server.get('/result', function (req, res, next) {
  var url = req.params.url;
  var itemSelector = req.params.item_selector;
  var childs = req.params.childs;
  var action = req.params.action;

  fetchPage(url, function(err, $) {
    var results = [];

    $.find(itemSelector).forEach(function(element) {      
      var item = {};
      var $element = null;

      childs.forEach(function(child) {
        $element = $(element).find(child.selector);

        if ($element.length > 1) {
          var arr = [];
          $element.each(function(_, el) {
            arr.push($(el)[action]());
          });

          item[child.name] = arr;
        } else {
          item[child.name] = $element[action]();
        }
      });
      results.push(item);
    });

    res.send({
      results: results
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
