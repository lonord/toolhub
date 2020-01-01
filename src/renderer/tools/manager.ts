import createHostConnection from './createHostConnection'

export enum ToolStatus {
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

export interface ToolsHookValue {
    tools: Tool[]
    installTool(filePath: string): void
    uninstallTool(id: string): void
    launchTool(id: string): void
    shutdownTool(id: string): void
}

export function useTools(): ToolsHookValue {
    // TODO
    return {} as any
}

/******************************************* init variables ******************************************/

const conn = createHostConnection()
