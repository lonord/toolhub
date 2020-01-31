import { SettingProvider } from '../service/createSettingService'
import { PluginManagerBridge, Plugin } from './Plugin'
import { ChildProcess } from 'child_process'
import { WriteStream, createWriteStream } from 'fs-extra'
import { isNumber } from 'util'
import createChildProcessExecutor from './createChildProcessExecutor'
import * as getPort from 'get-port'
import { ensureAndGetToolOutLogFile, ensureAndGetToolErrLogFile } from '../app/env'
import { createServer, Socket } from 'net'
import { createInterface } from 'readline'

const NET_SERVER_HOST = '127.0.0.1'

export type PluginDataListener = (id: string, data: string) => void

export interface PluginRunner {
    start(id: string): Promise<void>
    stop(id: string): Promise<void>
    listen(fn: PluginDataListener): void
    send(id: string, data: string): void
    isRunning(id: string): boolean
    injectPluginManagerBridge(mb: PluginManagerBridge): void
}

const createPluginRunner = (settingProvider: SettingProvider) => {
    const listeners: PluginDataListener[] = []
    const processMap: Map<string, PluginProcess> = new Map()
    const startingProcessSet = new Set<string>()
    let managerBridge: PluginManagerBridge

    const emit = (id: string, msg: string) => listeners.forEach(l => l(id, msg))

    const self = {
        start: async (id) => {
            if (self.isRunning(id)) {
                throw new Error(`plugin with id ${id} is already running`)
            }
            startingProcessSet.add(id)
            const p = await managerBridge.readPlugin(id)
            const pp = await startProcess(p, settingProvider)
            processMap.set(id, pp)
            startingProcessSet.delete(id)
            pp.listen(msg => emit(id, msg))
            pp.cp.once('exit', (code) => {
                if (isNumber(code) && code !== 0) {
                    // TODO report exit with non-zero code
                }
                cleanupProcess(pp)
            })
        },
        stop: async (id) => {
            if (!self.isRunning(id)) {
                return
            }
            const pp = processMap.get(id)
            if (!pp) {
                return
            }
            processMap.delete(id)
            await new Promise((resolve) => {
                pp.cp.kill()
                let exited = false
                pp.cp.once('exit', () => {
                    exited = true
                    resolve()
                })
                // check process status again after 5 sec
                setTimeout(
                    () => {
                        if (!exited) {
                            pp.cp.kill('SIGKILL')
                            resolve()
                        }
                    },
                    5000
                )
            })
        },
        listen: fn => listeners.push(fn),
        send: (id, data) => {
            if (!self.isRunning(id)) {
                return
            }
            const pp = processMap.get(id)
            pp?.send(data)
        },
        isRunning: id => processMap.has(id) || startingProcessSet.has(id),
        injectPluginManagerBridge: mb => managerBridge = mb
    } as PluginRunner
    return self
}

export default createPluginRunner

interface PluginProcess {
    cp: ChildProcess
    stdout: WriteStream
    stderr: WriteStream
    listen(fn: (msg: string) => void): void
    send(msg: string): void
    cleanup(): void
}

interface NetServer {
    waitClientReady(): Promise<void>
    listen(fn: (msg: string) => void): void
    send(msg: string): void
    close(): void
}

const startProcess = async (p: Plugin, settingProvider: SettingProvider) => {
    const execute = createChildProcessExecutor(p, settingProvider)
    const port = await getPort()
    const env = {
        ...process.env,
        TH_HOST_PORT: `${port}`,
        TH_HOST_ADDR: NET_SERVER_HOST
    }
    const s = await startNetServer(port)
    await s.waitClientReady()
    const stdout = await createFileStream(ensureAndGetToolOutLogFile(p.id))
    const stderr = await createFileStream(ensureAndGetToolErrLogFile(p.id))
    const pp = execute(env, stdout, stderr)
    return {
        stdout,
        stderr,
        cp: pp,
        listen: fn => s.listen(fn),
        send: msg => s.send(msg),
        cleanup: () => s.close()
    } as PluginProcess
}

const createFileStream = async (filePath: string) => {
    const stream = createWriteStream(filePath)
    await new Promise(resolve => stream.once('ready', resolve))
    return stream
}

const cleanupProcess = async (p: PluginProcess) => {
    p.stdout.close()
    p.stderr.close()
    p.cleanup()
}

const startNetServer = async (port: number) => {
    let c: Socket | undefined
    let connHook: (() => void) | undefined
    let listener: ((msg: string) => void) | undefined
    const server = createServer((client) => {
        c = client
        client.once('close', () => c = undefined)
        const rl = createInterface({
            input: client,
            crlfDelay: Infinity
        })
        rl.on('line', line => listener && listener(line))
        connHook && connHook()
    })
    await new Promise((resolve) => {
        server.listen(port, NET_SERVER_HOST, resolve)
    })

    return {
        waitClientReady: () => new Promise((resolve) => {
            if (c) {
                resolve()
            } else {
                connHook = resolve
            }
        }),
        listen: fn => listener = fn,
        send: (msg) => {
            if (c) {
                c.write(`${msg}\n`)
            }
        },
        close: () => {
            server.close()
            c = undefined
            connHook = undefined
            listener = undefined
        }
    } as NetServer
}
