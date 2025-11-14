import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// import { Volume, createFsFromVolume } from 'memfs'
import { createNfs3Server, createAsyncNfsHandler } from '@legit/nfs-serve'
import * as fs from 'fs'
import * as path from 'path'

// import { createlegit-boxFs } from '@sqlgite/nfs-serve/src/gitfs/createlegit-boxFs'
import * as fsDisk from 'node:fs'

// import http from 'isomorphic-git/http/node/index.cjs'
import { exec } from 'child_process'
// import { createGitSyncService } from '@legit'

import { createFileHandleManager } from '@legit/nfs-serve'

import { createGitSyncService, openLegitFs } from '@legit-sdk/core'

const configFilePath = path.join(app.getPath('userData'), 'nfs-server-config.json')

// Default configuration
const defaultConfig = {
  legitBoxFolder: path.join(app.getPath('home'), 'legit-box_real'),
  mountFolder: path.join(app.getPath('home'), 'legit-box'),
  repoUrl: '',
  user: '',
  password: '',
  origin: '',
  serverRunning: false,
  synchronize: false
}

// Read configuration from file
function readConfig(): typeof defaultConfig {
  if (fs.existsSync(configFilePath)) {
    const configData = fs.readFileSync(configFilePath, 'utf-8')

    console.log(configData)
    return JSON.parse(configData)
  }
  return defaultConfig
}

// Write configuration to file
function writeConfig(config: typeof defaultConfig): void {
  console.log(configFilePath)
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8')
}

// IPC handlers for reading and writing configuration
ipcMain.handle('read-config', (): typeof defaultConfig => {
  return readConfig()
})

ipcMain.handle('write-config', (_event, newConfig: typeof defaultConfig): void => {
  writeConfig(newConfig)
})

ipcMain.handle(
  'clone-repo',

  async (_event, repoSpec: { repoUrl: string; user: string; token: string }) => {
    const configData = readConfig()
    configData.password = repoSpec.token
    writeConfig(configData)
    // const config = readConfig()
    // console.log('checking ' + config.legit-boxFolder)
    // // Ensure the folder at config.legit-boxFolder exists
    // if (!fs.existsSync(config.legit-boxFolder)) {
    //   fs.mkdirSync(config.legit-boxFolder, { recursive: true })
    // }
    // try {
    //   console.log(repoSpec)
    //   await git.clone({
    //     fs,
    //     dir: config.legit-boxFolder,
    //     url: repoSpec.repoUrl,
    //     http,
    //     onProgress: (event) => {
    //       if (mainWindow) {
    //         mainWindow.webContents.send('clone-progress', event)
    //       }
    //     },
    //     onAuth: (url) => {
    //       console.log('auth foR URL ' + url)
    //       return {
    //         // username: repoSpec.user,
    //         username: repoSpec.token
    //       }
    //     }
    //   })
    //   const configData = readConfig()
    //   configData.password = repoSpec.token
    //   configData.repoUrl = repoSpec.repoUrl
    //   writeConfig(configData)
    //   console.log('clone done')
    // } catch (e) {
    //   // @ts-expect-error -- casting error
    //   return { success: false, message: e.message }
    // }
    // return { success: true }
  }
)

// IPC handler for selecting a folder
ipcMain.handle('select-legit-box-folder', async (): Promise<string | null> => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let nfsServer: any = null

let syncService: ReturnType<typeof createGitSyncService> | undefined

// const repoPath = '/my/repo/path'
// const TEST_FILE = 'normal.txt'
// const HIDDEN_FILE = 'hidden.txt'
// const BRANCH_FILE = '.branch.legit-box'

export function startNfsServer(): void {
  const { legitBoxFolder, password, mountFolder, synchronize } = readConfig()

  if (!nfsServer) {
    const legitFs = openLegitFs(fsDisk, legitBoxFolder)

    if (!fs.existsSync(legitBoxFolder)) {
      fs.mkdirSync(legitBoxFolder, { recursive: true })
    }

    if (!fs.existsSync(mountFolder)) {
      fs.mkdirSync(mountFolder, { recursive: true })
    }

    syncService = createGitSyncService({
      fs,
      gitRepoPath: legitBoxFolder,
      originPrefix: 'origin',
      user: 'x',
      password
    })
    const fhM = createFileHandleManager(
      legitBoxFolder,
      Math.floor(Date.now() / 1000 - 25 * 365.25 * 24 * 60 * 60) * 1000000
    )

    const asyncHandlers = createAsyncNfsHandler({
      fileHandleManager: fhM,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      asyncFs: legitFs.promises as any
    })

    nfsServer = createNfs3Server(asyncHandlers)

    if (synchronize) {
      syncService.start()
    }
  }

  nfsServer.listen(2049, (): void => {
    console.log('NFS server listening on port 2049')

    // Unmount the folder first
    exec(`umount ${mountFolder}`, (err) => {
      if (err) {
        console.error(`Failed to unmount ${mountFolder}:`, err.message)
      }

      console.log(`${mountFolder} unmounted successfully.`)

      // Mount the folder
      exec(
        `mount_nfs -o noappledouble,noapplexattr,nolocks,soft,retrans=2,timeo=10,vers=3,tcp,rsize=131072,actimeo=120,port=2049,mountport=2049 localhost:/ ${mountFolder}`,
        (err) => {
          if (err) {
            console.error(`Failed to mount ${mountFolder}:`, err.message)
            return
          }

          console.log(`${mountFolder} mounted successfully.`)
        }
      )
    })
  })
}

export function stopNfsServer(): void {
  syncService?.stop()
  if (!nfsServer) {
    console.log('NFS server is not running.')
    return
  }

  const { mountFolder } = readConfig()

  exec(`umount ${mountFolder}`, (err) => {
    if (err) {
      console.error(`Failed to unmount ${mountFolder}:`, err.message)
    }
    nfsServer.close((): void => {
      console.log('NFS server stopped.')
      nfsServer = null
    })
  })
  console.log(`${mountFolder} unmounted successfully.`)
}

// Example IPC handlers for starting and stopping the server
ipcMain.handle('start-nfs-server', (): void => {
  const config = readConfig()
  config.serverRunning = true
  writeConfig(config)
  startNfsServer()
})

ipcMain.handle('stop-nfs-server', (): void => {
  const config = readConfig()
  config.serverRunning = false
  writeConfig(config)
  stopNfsServer()
})

ipcMain.handle('start-syncing', (): void => {
  const config = readConfig()
  config.synchronize = true
  writeConfig(config)
  syncService?.start()
})

ipcMain.handle('stop-syncing', (): void => {
  const config = readConfig()
  config.synchronize = false
  writeConfig(config)
  syncService?.stop()
})

let mainWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const config = readConfig()
  if (config.serverRunning) {
    startNfsServer()
  }

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  stopNfsServer()
})

app.on('quit', () => {
  stopNfsServer()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
