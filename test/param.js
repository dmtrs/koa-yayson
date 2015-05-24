
var request = require('supertest');
var json = require('..');
var koa = require('koa');
var ItemsPresenter = require('yayson')({adapter: 'default' }).Presenter;

describe('param', function(){
  it('should default to being disabled', function(done){
    var app = koa();

    app.use(json({ pretty: false, presenter: new ItemsPresenter() }));

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });
    app.on('error', function(err) {
        console.log('err', err);
    });
    request(app.listen())
    .get('/?pretty')
    .expect('{"data":{"type":"objects","attributes":{"foo":"bar"}}}', done);
  })

  it('should pretty-print when present', function(done){
    var app = koa();

    app.use(json({ pretty: false, param: 'pretty', presenter: new ItemsPresenter() }));

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/?pretty')
    .expect('{\n  "data": {\n    "type": "objects",\n    "attributes": {\n      "foo": "bar"\n    }\n  }\n}', done);
  })
})
