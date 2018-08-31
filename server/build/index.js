'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODE_PRODUCTION = 'production';
var MODE_DEVELOPMENT = 'development';

var app = (0, _express2.default)();
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.set('port', process.env.API_PORT || 3001);

var isProduction = function isProduction() {
  return process.env.NODE_ENV === MODE_PRODUCTION;
};
var isDevelopment = function isDevelopment() {
  return process.env.NODE_ENV === MODE_PRODUCTION;
};

if (isProduction()) {
  app.use(_express2.default.static('../client/build'));
}

app.get('*', function (req, res) {
  if (!isProduction()) {
    res.status(200).send('you should not access the server when NODE_ENV is in development mode or other modes');
  }
});

app.listen(app.get('port'), function () {
  console.log('Find the server at: http://localhost:' + app.get('port') + '/'); // eslint-disable-line no-console
});
//# sourceMappingURL=index.js.map