const https = require('https');

var request = (auth, postData = '', next = () => { }) => {
    var options = {
        hostname: 'api.tinypng.com',
        port: 443,
        path: '/shrink',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + auth
        }
    };

    var req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let chunk = '';
        res.on('data', (d) => {
            chunk += d;
        });
        res.on('end', () => {
            next({
                status: 0,
                headers: res.headers,
                body: chunk
            });
        });
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        next({
            status: 1,
            msg: e.message
        });
    });
    req.write(postData);
    req.end();
};

module.exports = request;