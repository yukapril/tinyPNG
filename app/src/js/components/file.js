const https = require('https');
const fs = require('fs');

var readFile = (filePath, next = () => {}) => {
    fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        next(data);
    });
};

var getFile = (url, dst, next) => {
    https.get(url, (res) => {
        res.pipe(fs.createWriteStream(dst));
        next();
    });
};

module.exports = {
    readFile,
    getFile
};