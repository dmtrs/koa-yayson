
var isJSON = require('koa-is-json');
var Stringify = require('streaming-json-stringify');

/**
 * Pretty JSON response middleware.
 *
 *  - `pretty` default to pretty response [true]
 *  - `param` optional query-string param for pretty responses [none]
 *
 * @param {Object} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function(opts){
  var opts = opts || {};
  var param = opts.param;
  var pretty = null == opts.pretty ? true : opts.pretty;
  var spaces = opts.spaces || 2;
  var presenter = opts.presenter || null;

  return function *filter(next){
    yield *next;

    var body = this.body;
    // unsupported body type
    var stream = body
      && typeof body.pipe === 'function'
      && body._readableState
      && body._readableState.objectMode;
    var json = isJSON(body);
    if (!json && !stream) return;

    // query
    var hasParam = param && this.query.hasOwnProperty(param);
    var prettify = pretty || hasParam;

    // always stringify object streams
    if (stream) {
      this.response.type = (presenter)?'application/vnd.api+json':'json';
      var stringify = Stringify();
      if (prettify) stringify.space = spaces;
      this.body = body.pipe(stringify);
      return;
    }
    if (presenter) {
        this.response.type = 'application/vnd.api+json';
        body = presenter.render(body);
    }

    // prettify JSON responses
    if (json && prettify) {
      return this.body = JSON.stringify(body, null, spaces);
    }
    return this.body = body;
  }
};
