const fs = require('fs');
const path = require('path');
const srcPath = './src/js/components/';
const auth = require(srcPath + 'auth');
const request = require(srcPath + 'tinyPNG');
const {
    readFile,
    getFile
} = require(srcPath + 'file');
const size = require(srcPath + 'size');

var exePath = path.resolve(__dirname);
if (process.platform === 'darwin') {
    exePath = path.resolve(exePath, '../../../../../')
} else if (process.platform === 'win') {

} else {

}
console.log('当前工作目录path：', exePath);
var CONFIG_DEFAULT = {};
var CONFIG_USER = {};
var CONFIG = {};
try {
    CONFIG_DEFAULT = require('./config.json');
    CONFIG_USER = require(exePath + '/config.json');
} catch (ex) {}

Object.assign(CONFIG, CONFIG_DEFAULT, CONFIG_USER);

var KEY = '';
if (CONFIG.key) {
    KEY = CONFIG.key;
}

document.ready = function (callback) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function () {
            document.removeEventListener('DOMContentLoaded', arguments.callee, false);
            callback();
        }, false)
    }
}

var main = {
    drag: (next = () => {}) => {
        document.body.ondragover = document.body.ondrop = (e) => {
            e.preventDefault();
            return false;
        };
        var txtData = {};
        var elFile = document.querySelector('#J_FileSelect');
        elFile.ondragenter = (e) => {
            e.preventDefault();
            elFile.classList.add('dragin');
            return false;
        }
        elFile.ondragleave = (e) => {
            e.preventDefault();
            elFile.classList.remove('dragin');
            return false;
        };
        elFile.ondragover = (e) => {
            e.preventDefault();
            return false;
        }
        elFile.ondrop = (e) => {
            e.preventDefault();
            elFile.classList.remove('dragin');
            let files = e.dataTransfer.files;
            next(files);
        };
        return false;
    },
    tinypng: (filePath, next) => {
        readFile(filePath, (data) => {
            var authStr = auth(app.key);
            request(authStr, data, (json) => {
                next(json);
            });
        });
    }
}

var app = new Vue({
    el: '#J_App',
    data: {
        key: KEY,
        list: []
    },
    methods: {
        remove: function (item) {
            this.list.splice(this.list.indexOf(item), 1);
        },
        tiny: function () {
            if (!app.key) {
                alert('key不存在。');
                return;
            }
            for (let item of this.list) {
                (function (i) {
                    i.status = '进行中...';
                    main.tinypng(i.path, (json) => {
                        var data = {};
                        try {
                            data = JSON.parse(json.body);
                            i.nsize = size(data.output.size);
                            i.ratio = (data.output.ratio * 100).toFixed(2);
                            var dst = i.pathWithoutName + '/' + i.nameWithoutExt + '.tiny' + i.ext;
                            getFile(data.output.url, dst, () => {
                                i.status = '完成';
                            });
                        } catch (ex) {
                            i.status = '失败';
                        }
                    });
                }(item));
            }
        }
    }
});

document.ready(() => {
    // 文件编号
    var uid = 0;
    // 拖拽
    main.drag((files) => {
        for (let file of files) {
            // 判断文件是否合法
            var allowImgFlag = false;
            for (let type of CONFIG.allowImgType) {
                if (file.type === type) {
                    allowImgFlag = true;
                }
            }
            if (!allowImgFlag) return;

            // 解析文件属性
            var p = path.parse(file.path);
            app.list.push({
                id: ++uid,
                path: file.path,
                name: file.name,
                ext: p.ext,
                pathWithoutName: p.dir,
                nameWithoutExt: p.name,
                status: '准备',
                osize: size(file.size),
                nsize: '',
                ratio: ''
            });
        }
    });
});