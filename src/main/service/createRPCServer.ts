import { CommandHandler } from '../../common/conn'
import { ICommand, ICommandType } from '../../common/util/createCommand'
import { ipcMain } from 'electron'

export type ReplyFn = CommandHandler

export type ServerCommandHandler = (reply: ReplyFn, cmd: ICommand<any>) => void

export interface RPCServer {
    push: CommandHandler
    listen: (fn: ServerCommandHandler, ...events: ICommandType<any>[]) => void
}

const createRPCServer = () => {
    return {
        push: (cmd) => {
            ipcMain.emit(cmd.type, cmd.args)
        },
        listen: (fn, events) => {
            listen(fn, events)
        }
    } as RPCServer
}

function listen(listener: ServerCommandHandler, ...events: ICommandType<any>[]) {
    events.forEach((event) => {
        ipcMain.on(event.type, (e: any, arg: any) => {
            listener(
                (cmd) => {
                    e.reply.call(cmd.type, cmd.args)
                },
                event(arg)
            )
        })
    })
}

export default createRPCServer
