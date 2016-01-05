var path = require('path');
var Express = require('express');
var app = Express();

const PATH_DIST = path.resolve(__dirname, '../static');

app.use(Express.static(PATH_DIST));

app.get("/*", function(req, res, next) {
  res.sendfile(PATH_DIST + '/index.html');
});

var server = app.listen(process.env.PORT || 8000, () => {
  var port = server.address().port;

  console.log('Server is listening at %s', port);
});
