const { ipcRenderer, remote,dialog } = require('electron');


// 菜单操作
ipcRenderer.on('action', (event, arg) => {
    switch (arg) {
        case 'new': // 新建文档
            askSaveNeed();
            initDoc();
            break;
        case 'open': // 打开文档
            askSaveNeed();
            openFile();
            wordsCount();
            break;
        case 'save': // 保存当前文档
            saveCurrentDoc();
            break;
        case 'save-as': // 另存为当前文档
            currentFile = null;
            saveCurrentDoc();
            break;
        case 'exit': // 退出
            askSaveNeed();
            if (isQuit) { // 正常退出
                ipcRenderer.sendSync('exit');
            }
            isQuit = true; // 复位正常退出
            break;
    }
});

// 初始化文档
function initDoc() {
    currentFile = null;
    txtEditor.value = '';
    document.title = 'Notepad - Untitled';
    isSave = true;
    document.getElementById("txtNum").innerHTML = 0;
}


// 询问是否保存命令
function askSaveNeed() {
    // 检测是否需要执行保存命令
    if (isSave) {
        return;
    }
    // 弹窗类型为 message
    const options = {
        type: 'question',
        message: '请问是否保存当前文档？',
        buttons: ['Yes', 'No', 'Cancel']
    }
    // 处理弹窗操作结果
    const selection = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
    // 按钮 yes no cansel 分别为 [0, 1, 2]
    if (selection == 0) {
        saveCurrentDoc();
    } else if (selection == 1) {
        console.log('Cancel and Quit!');
    } else { // 点击 cancel 或者关闭弹窗则禁止退出操作
        console.log('Cancel and Hold On!');
        isQuit = false; // 阻止执行退出
    }
}


// 保存文档，判断新文档or旧文档
function saveCurrentDoc() {
    // 新文档则执行弹窗保存操作
    if (!currentFile) {
        const options = {
            title: 'Save',
            filters: [
                { name: 'Text Files', extensions: ['txt', 'js', 'html', 'md'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        }
        const paths = dialog.showSaveDialogSync(remote.getCurrentWindow(), options);
        if (paths) {
            currentFile = paths;
        }
    }
    // 旧文档直接执行保存操作
    if (currentFile) {
        const txtSave = txtEditor.value;
        saveText(currentFile, txtSave);
        isSave = true;
        document.title = "Notepad - " + currentFile;
    }

}


// 选择文档路径
function openFile() {
    // 弹窗类型为openFile
    const options = {
        filters: [
            { name: 'Text Files', extensions: ['txt', 'js', 'html', 'md'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    }
    // 处理弹窗结果
    const file = dialog.showOpenDialogSync(remote.getCurrentWindow(), options);
    if (file) {
        currentFile = file[0];
        const txtRead = readText(currentFile);
        txtEditor.value = txtRead;
        document.title = 'Notepad - ' + currentFile;
        isSave = true;
    }

}


// 执行保存的方法
function saveText(file, text) {
    const fs = require('fs');
    fs.writeFileSync(file, text);
}


// 读取文档方法
function readText(file) {
    const fs = require('fs');
    return fs.readFileSync(file, 'utf8');
}
