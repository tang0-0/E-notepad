// 声明模块
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');


// 主菜单模板
const menuTemplate = [
  {
    label: ' 文件 ',
    submenu: [
      {
        label: '新建',
        accelerator: 'CmdOrCtrl+N',
        click: function () {
          mainWindow.webContents.send('action', 'new')
        }
      },
      {
        label: '打开',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
          mainWindow.webContents.send('action', 'open')
        }
      },
      {
        label: '保存',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
          mainWindow.webContents.send('action', 'save')
        }
      },
      {
        label: '另存为...  ',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: function () {
          mainWindow.webContents.send('action', 'save-as')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        click: function () {
          mainWindow.webContents.send('action', 'exit')
        }
      }
    ]
  },
  {
    label: ' 编辑 ',
    submenu: [
      { label: '返回', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: '重做', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
      { type: 'separator' },  //分隔线
      { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      { label: '删除', accelerator: 'CmdOrCtrl+D', role: 'delete' },
      { type: 'separator' },  //分隔线
      { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
      {
        label: 'DevTools', accelerator: 'CmdOrCtrl+I',
        click: function () {
          mainWindow.webContents.openDevTools();
        }
      },
      { accelerator: 'CmdOrCtrl+R', role: 'reload' }
    ]
  }
];

// 构建主菜单
let menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
  }
    
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// 接收退出命令
ipcMain.on('exit', function() {
  
  app.quit();
});