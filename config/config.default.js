module.exports = () => {
  const exports = {};

  exports.zipkinMW = {
    serviceName: 'sample-service', //this option only works in global middleware
  }
};