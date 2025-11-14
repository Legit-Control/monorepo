import { useState } from 'react'
// import { ipcRenderer } from 'electron'
import './index.css'

const ipcRenderer = window.electron.ipcRenderer

let initialize = false

function App(): React.JSX.Element {
  const [step, setStep] = useState(1)
  const [repoUrl, setRepoUrl] = useState('')
  const [username, setUsername] = useState('')
  const [token, setToken] = useState('')

  const [serverRunning, setServerRunning] = useState(false)
  const [synchronize, setSynchronize] = useState(false)

  const [cloning, setCloning] = useState<
    { phase?: string; loaded?: number; total?: number; repoUrl?: string } | undefined
  >(undefined)

  const loadConfig = async () => {
    if (!initialize) {
      initialize = true
      const config = await ipcRenderer.invoke('read-config')
      setRepoUrl(config.repoUrl)

      setUsername(config.user ?? 'xxxx')

      setToken(config.password)
      setSynchronize(config.synchronize)
      setServerRunning(config.serverRunning)
    }
  }

  loadConfig()

  const handleSelectFolder = async (): Promise<void> => {
    try {
      const folderPath = await ipcRenderer.invoke('select-legit-box-folder')
      if (folderPath) {
        console.log('Selected folder:', folderPath)

        // Update the configuration with the selected folder
        const config = await ipcRenderer.invoke('read-config')
        config.gitRepoPath = folderPath
        await ipcRenderer.invoke('write-config', config)

        console.log('Configuration updated with selected folder.')
      } else {
        console.log('Folder selection was canceled.')
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  const handleSetupStep1 = async (args: {
    repoUrl: string
    user: string
    password: string
  }): Promise<void> => {
    try {
      if (args.repoUrl && args.user && args.password) {
        setCloning({ phase: 'cloning', repoUrl })
        window.electron.ipcRenderer.on('clone-progress', (_e, v) => {
          console.log(JSON.stringify(v))
          setCloning({ ...v, repoUrl })
        })
        const result = await ipcRenderer.invoke('clone-repo', {
          repoUrl: args.repoUrl,
          username: args.user,
          token: args.password
        })
        setCloning(undefined)

        if (!result.success) {
          alert(result.message)
          return
        }
        // console.log('Repository cloning initiated.' + result)
      } else {
        alert('Please fill in all fields before proceeding.')
        return
      }
    } catch (error) {
      setCloning(undefined)
      console.error('Error initiating repository cloning:', error)
    }
    setStep((prevStep) => prevStep + 1)
  }

  const handleNext = async (): Promise<void> => {
    setStep((prevStep) => prevStep + 1)
  }

  const handleBack = (): void => {
    setStep((prevStep) => Math.max(prevStep - 1, 1))
  }

  const handleFinish = (): void => {
    console.log('Setup finished')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
      <label className="flex items-center space-x-3">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          onChange={async (e) => {
            setServerRunning(e.target.checked)
            if (e.target.checked) {
              ipcRenderer.invoke('start-nfs-server')
            } else {
              ipcRenderer.invoke('stop-nfs-server')
            }
          }}
          checked={serverRunning}
        />
        <span className="text-gray-700">Start legit-box</span>
      </label>
      <label className="flex items-center space-x-3">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          onChange={(e) => {
            setSynchronize(e.target.checked)
            if (e.target.checked) {
              ipcRenderer.invoke('start-syncing')
            } else {
              ipcRenderer.invoke('stop-syncing')
            }
          }}
          checked={synchronize}
        />
        <span className="text-gray-700">Synchronize</span>
      </label>
      {step === 1 && (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
          <div className="bg-gray-900 shadow-2xl rounded-lg p-8 max-w-lg w-full">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-400">
              Setup legit-box
            </h1>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="GitHub Repo URL"
                className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="GitHub Username"
                className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="GitHub Token"
                className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </form>
            <div className="flex justify-end mt-8">
              <button
                className="btn bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500"
                onClick={() => {
                  handleSetupStep1({
                    repoUrl,
                    password: token,
                    user: username
                  })
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        {step === 2 && (
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Step 2: Select a Folder</h1>
            <p className="text-gray-400 mb-4 text-center">
              Choose a folder where your Git repository will be stored.
            </p>
            <button className="btn btn-primary w-full py-2 mb-4" onClick={handleSelectFolder}>
              Select Folder
            </button>
            <button
              className="btn bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              onClick={handleBack}
            >
              Back
            </button>
            <button className="btn btn-secondary w-full py-2" onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Step 3: Cloning Progress</h1>
            <p className="text-gray-400 mb-4 text-center">
              Cloning repository... (progress bar placeholder)
            </p>
            <div className="flex justify-between">
              <button
                className="btn btn-outline text-white border-gray-600 hover:bg-gray-700"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="btn btn-success bg-green-600 hover:bg-green-700"
                onClick={handleFinish}
              >
                Finish
              </button>
            </div>
          </div>
        )}
      </div>

      {cloning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white z-50">
          <div className="text-center">
            <p className="text-xl font-bold">
              Cloning {cloning.repoUrl}... {cloning.phase}
              <br />
              {cloning.total !== undefined && (
                <div>
                  ({cloning.loaded} / {cloning.total})
                </div>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
