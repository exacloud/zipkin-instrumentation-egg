# egg-zipkin
Before the official team publish their egg-zipkin plugin, try this one! 😀
Happy to recieve suggestions and comments.

## Install
``````
$ npm i egg-zipkin --save
``````

##How to Use
###zipkin-instrumentation-egg
zipkin instrumentation for egg as a plugin.

install this to an egg server,use this globally or in router(recommend):
``````
const zipkinMW_Sample_Service = app.middleware.zipkinMW({serviceName: 'sample-service'})
app.router.get('/', zipkinMW_Sample_Service, app.controller.handler);
``````
and use docker, visit localhost:9411 to see what happens
``````
$ docker run -d -p 9411:9411 openzipkin/zipkin
``````