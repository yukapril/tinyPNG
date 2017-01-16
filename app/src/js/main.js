const fs = require('fs');
const path = require('path');
const {ipcRenderer} = require('electron');
const srcPath = './src/js/components/';
const auth = require(srcPath + 'auth');
const request = require(srcPath + 'tinyPNG');
const {
    readFile,
    getFile
} = require(srcPath + 'file');
const size = require(srcPath + 'size');
const APP_PATH = ipcRenderer.sendSync('appPath', '');

var CONFIG_DEFAULT = {};
var CONFIG_USER = {};
var CONFIG = {};
try {
    CONFIG_DEFAULT = require('./config.json');
    CONFIG_USER = require(APP_PATH + '/config.json');
} catch (ex) { }

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
    drag: (next = () => { }) => {
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
            var authStr = auth(vueApp.key);
            request(authStr, data, (json) => {
                next(json);
            });
        });
    }
}

var vueApp = new Vue({
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
            if (!vueApp.key) {
                alert('key不存在。');
                return;
            }
            for (let item of this.list) {

                if (item.status !== 1 && item.status !== 2) {
                    // 不是进行中/已完成状态
                    (function (i) {
                        i.statusName = '进行中...';
                        i.status = 1;
                        main.tinypng(i.path, (json) => {
                            var data = {};
                            try {
                                data = JSON.parse(json.body);
                                if (data.error === 'Unauthorized') {
                                    i.statusName = "key无效";
                                    i.status = 11;
                                } else {
                                    i.nsize = size(data.output.size);
                                    i.ratio = (data.output.ratio * 100).toFixed(2);
                                    var dst = i.pathWithoutName + '/' + i.nameWithoutExt + '.tiny' + i.ext;
                                    getFile(data.output.url, dst, () => {
                                        i.statusName = '完成';
                                        i.status = 2;
                                    });
                                }
                            } catch (ex) {
                                i.statusName = '失败';
                                i.status = 99;
                            }
                        });
                    } (item));
                }
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
            vueApp.list.push({
                id: ++uid,
                path: file.path,
                name: file.name,
                ext: p.ext,
                pathWithoutName: p.dir,
                nameWithoutExt: p.name,
                statusName: '准备',
                status: 0, //0:准备，1:进行中，2:完成，11:key无效，99:失败（tiny返回错误json数据）
                osize: size(file.size),
                nsize: '',
                ratio: ''
            });
        }
    });
});