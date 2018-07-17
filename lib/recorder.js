const {
  BatchRecorder,
  jsonEncoder: {JSON_V1, JSON_V2}
} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');

// Send spans to Zipkin asynchronously over HTTP

module.exports.recorder = async ({targetServer, targetApi, jsonEncoder}) => new BatchRecorder({
    logger: new HttpLogger({
        endpoint: `${targetServer}${targetApi}`,
        jsonEncoder: (jsonEncoder === 'v2' || jsonEncoder === 'V2') ? JSON_V2 : JSON_V1
    })
});