'use strict';
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron');
const path = require('path');
const appPath = path.parse(app.getPath('exe')).dir;

const template = [{
    label: '',
    submenu: [{
        role: 'services',
        label: '服务',
        submenu: []
    }, {
        type: 'separator'
    }, {
        role: 'hide',
        label: '隐藏'
    }, {
        role: 'hideothers',
        label: '隐藏其它'
    }, {
        role: 'unhide',
        label: '显示'
    }, {
        type: 'separator'
    }, {
        role: 'quit',
        label: '退出'
    }]
}, {
    label: '编辑',
    submenu: [{
        role: 'undo',
        label: '撤销'
    }, {
        role: 'redo',
        label: '重做'
    }, {
        type: 'separator'
    }, {
        role: 'cut',
        label: '剪切'
    }, {
        role: 'copy',
        label: '拷贝'
    }, {
        role: 'paste',
        label: '粘贴'
    }, {
        role: 'delete',
        label: '删除'
    }, {
        role: 'selectall',
        label: '全选'
    }]
}, {
    label: '工具',
    submenu: [{
        label: '刷新',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
        }
    }, {
        label: '调试工具',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
    }]
}];

const menu = Menu.buildFromTemplate(template);

let mainWindow;

let main = {
    mainWindow() {
        mainWindow = new BrowserWindow({
            title: 'TinyPNG',
            width: 700,
            height: 600,
            resizable: true,
            backgroundColor: '#fff',
            defaultFontFamily: 'Microsoft YaHei',
            defaultEncoding: 'utf-8',
            frame: true,
            icon: `${__dirname}/app/src/img/app.ico`
        });
        mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    },
    init() {
        this.mainWindow();
    }
};

app.on('ready', () => {
    main.init();
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
    app.exit(0);
});

ipcMain.on('appPath', (event, arg) => {
    event.returnValue = appPath;
})