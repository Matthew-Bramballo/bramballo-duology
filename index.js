// Imports
const path          = require('path');
const electron      = require('electron');

const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const htmlPath      = path.join(__dirname, './index.html');

// Executes when Electron is ready
app.on('ready', () => {

    // Create a new window
    let mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080
    });

    // Load our game
    mainWindow.loadURL(`file://${htmlPath}`);
    mainWindow.setMenu(null);
    mainWindow.setFullScreen(true);
});

// Executes when all Electron windows are closed
app.on('window-all-closed', () => {

  // Quit our application
  app.quit();
});