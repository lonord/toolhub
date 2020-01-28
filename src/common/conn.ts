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

export interface MutableTool {
    id: string
    name: string
    icon: string
    version: string
    status: ToolStatus
}

export type Tool = Readonly<MutableTool>

export type FilePathArg = string
export type IdArg = string
export type NoArg = typeof NoArg
export type ToolsArg = Tool[]
export type IdMsgArg = { id: string, msg: string }
export type SettingArg = Setting
export type SettingModifyArg = Partial<Setting>

export const installCommand = createCommand<FilePathArg>('install')
export const uninstallCommand = createCommand<IdArg>('uninstall')
export const launchCommand = createCommand<IdArg>('launch')
export const shutdownCommand = createCommand<IdArg>('shutdown')
export const toolsRequestCommand = createCommand<NoArg>('tools-request')
export const toolsUpdateCommand = createCommand<ToolsArg>('tools-update')
export const toolDataRequestCommand = createCommand<IdArg>('tool-data-request')
export const toolDataUpdateCommand = createCommand<IdMsgArg>('tool-data-update')
export const toolDataSubmitCommand = createCommand<IdMsgArg>('tool-data-submit')

export const settingRequestCommand = createCommand<NoArg>('setting-request')
export const settingUpdateCommand = createCommand<SettingArg>('setting-update')
export const settingModifyCommand = createCommand<SettingModifyArg>('setting-modify')

export type CommandHandler = (cmd: ICommand<any>) => void
