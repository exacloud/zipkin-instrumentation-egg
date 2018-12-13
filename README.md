# egg-zipkin

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-zipkin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-zipkin
[download-image]: https://img.shields.io/npm/dm/egg-zipkin.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-zipkin

The official team (ali) publish their egg-opentracing-zipkin plugin.Best wishes to them!

Well,this one is still being maintained continuously. 😀

New features in coming! 

Happy to recieve suggestions and comments.

issue page:https://github.com/exacloud/zipkin-instrumentation-egg/issues

## Install
```bash
$ npm i egg-zipkin --save
```

## Usage

### zipkin-instrumentation-egg
zipkin instrumentation for egg as a plugin.

Install this to an egg server,use this in your router:
```js
// {app_root}/config/plugin.js
exports.zipkin = {
  enable: true,
  package: 'egg-zipkin',
};

//{app_root}/config/config.xxx.js
exports.zipkin = {
    serviceName: 'awesome-service',
    httpsOn: false, // if you set this to true, it will use https protocal to visit your targetServer
    targetServer: '127.0.0.1:9411',
    targetApi: '/api/v2/spans',
    jsonEncoder: 'v2', // you can choose 'v1' or 'v2',
    consoleRecorder: false // if you set this to true , it will use ConsoleRecorder to print messages on your console.Thus only serviceName will be used.
}; 
```
Set consoleRecorder to false or just do nothing with it, and then use docker, visit localhost:9411 (or your target listener api: `${httpsOn ? 'https://' : 'http://''}${targetServer}${targetApi}`) to see what happens
```bash
$ docker run -d -p 9411:9411 openzipkin/zipkin
```

p.s.

In this version, it supports tracing globally! Cheers! (>ω<) 
## License

[MIT](LICENSE)