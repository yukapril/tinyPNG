var auth = (key) => new Buffer('api:' + key).toString('base64');

module.exports = auth;