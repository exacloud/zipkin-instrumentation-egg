module.exports.defaultValue = {
    serviceName: 'sample-service', //this option only works in global middleware
    httpsOn: false,
    targetServer: '127.0.0.1:9411',
    targetApi: '/api/v2/spans',
    jsonEncoder: 'v2',
    consoleRecorder: false
};