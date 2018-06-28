# egg-zipkin

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-zipkin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-zipkin
[download-image]: https://img.shields.io/npm/dm/egg-zipkin.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-zipkin

Before the official team publish their egg-zipkin plugin, try this one! 😀
Happy to recieve suggestions and comments.

## Install
```bash
$ npm i egg-zipkin --save
```

## Usage

### zipkin-instrumentation-egg
zipkin instrumentation for egg as a plugin.

install this to an egg server,use this globally or in router(recommend):
```js
// {app_root}/config/plugin.js
exports.zipkin = {
  enable: true,
  package: 'egg-zipkin',
};

//{app_root}/app/router.js
const zipkinMW_Sample_Service = app.middleware.zipkinMW({serviceName: 'sample-service'})
app.router.get('/', zipkinMW_Sample_Service, app.controller.handler);
```
and use docker, visit localhost:9411 to see what happens
```bash
$ docker run -d -p 9411:9411 openzipkin/zipkin
```

## License

[MIT](LICENSE)