import createCommand from './util/createCommand'

export const NoArg = 0

export enum ToolStatus {
    UNKNOW = 0,
    STARTING,
    STARTED_WITH_ERROR,
    RUNNING,
    STOPPING,
    STOPPED,
    STOPPED_WITH_ERROR,
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

export const installCommand = createCommand<FilePathArg>('install')
export const uninstallCommand = createCommand<IdArg>('uninstall')
export const launchCommand = createCommand<IdArg>('launch')
export const shutdownCommand = createCommand<IdArg>('shutdown')
export const toolsRequestCommand = createCommand<NoArg>('toolsRequest')
export const toolsUpdateCommand = createCommand<ToolsArg>('toolsUpdate')
