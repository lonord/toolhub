import { ipcRenderer } from 'electron'
import { ICommand, ICommandType } from '../../common/util/createCommand'
import { toolsUpdateCommand } from '../../common/conn'
export * from '../../common/conn'

export type ConnListener = (cmd: ICommand<any>) => void

export interface HostConnection {
    exec(cmd: ICommand<any>): void
    listen(fn: ConnListener): () => void
}

export default function createHostConnection(): HostConnection {
    const listeners = [] as ConnListener[]
    listen(listeners, toolsUpdateCommand)
    return {
        exec: (cmd) => {
            ipcRenderer.send(cmd.type, cmd.args)
        },
        listen: (fn) => {
            if (listeners.indexOf(fn) === -1) {
                listeners.push(fn)
            }
            return () => {
                const idx = listeners.indexOf(fn)
                if (idx >= 0) {
                    listeners.splice(idx, 1)
                }
            }
        }
    } as HostConnection
}

function listen(listeners: ConnListener[], ...events: ICommandType<any>[]) {
    events.forEach((event) => {
        ipcRenderer.on(event.type, (_: any, arg: any) => {
            trigger(event, arg, listeners)
        })
    })
}

function trigger<T>(event: ICommandType<T>, arg: T, listeners: ConnListener[]) {
    const cmd = event(arg)
    listeners.forEach((l) => {
        l(cmd)
    })
}
