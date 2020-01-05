import createCommand, { ICommand } from './util/createCommand'
import { Setting } from './setting'

export const NoArg = 0

export enum ToolStatus {
    UNKNOW = 0,
    STARTING,
    RUNNING,
    STOPPING,
    STOPPED,
    INSTALLING,
    UNINSTALLING
}

export interface Tool {
    readonly id: string
    readonly name: string
    readonly icon: string
    readonly version: string
    readonly status: ToolStatus
}

export type FilePathArg = string
export type IdArg = string
export type NoArg = typeof NoArg
export type ToolsArg = Tool[]
export type IdMsgArg = { id: string, msg: string }
export type SettingArg = Setting

export const installCommand = createCommand<FilePathArg>('install')
export const uninstallCommand = createCommand<IdArg>('uninstall')
export const launchCommand = createCommand<IdArg>('launch')
export const shutdownCommand = createCommand<IdArg>('shutdown')
export const toolsRequestCommand = createCommand<NoArg>('tools-request')
export const toolsUpdateCommand = createCommand<ToolsArg>('tools-update')

export const settingRequestCommand = createCommand<NoArg>('setting-request')
export const settingUpdateCommand = createCommand<SettingArg>('setting-update')

export type CommandHandler = (cmd: ICommand<any>) => void
