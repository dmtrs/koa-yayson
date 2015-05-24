
var request = require('supertest');
var json = require('..');
var koa = require('koa');
var Presenter = require('yayson')({ adapter: 'default' }).Presenter;

describe('pretty', function(){
  it('should default to true', function(done){
    var app = koa();

    app.use(json());

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('{\n  "foo": "bar"\n}', done);
  })

  it('should retain content-type', function(done){
    var app = koa();

    app.use(json());

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('Content-Type', /application\/json/, done);
  })

  it('should change content-type when presenter', function(done){
    var app = koa();

    app.use(json({ presenter: new Presenter() }));

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('Content-Type', /application\/vnd\.api\+json/, done);
  })

  it('should pass through when false', function(done){
    var app = koa();

    app.use(json({ pretty: false }));

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('{"foo":"bar"}', done);
  })

  it('should allow custom spaces', function(done){
    var app = koa();

    app.use(json({
      pretty: true,
      spaces: 4
    }));

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('{\n    "foo": "bar"\n}', done);
  })
})
