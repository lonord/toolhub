import * as React from 'react'
import createHostConnection, {
    toolsUpdateCommand,
    toolsRequestCommand,
    NoArg,
    installCommand,
    Tool,
    uninstallCommand,
    launchCommand,
    shutdownCommand
} from './createHostConnection'
import { isCommandType } from '../../common/util/createCommand'
export { ToolStatus } from './createHostConnection'

const { useState, useEffect } = React

export interface ToolsHookValue {
    tools: Tool[]
    installTool(filePath: string): void
    uninstallTool(id: string): void
    launchTool(id: string): void
    shutdownTool(id: string): void
}

export function useTools(): ToolsHookValue {
    const [tools, setTools] = useState<Tool[]>([])
    useEffect(
        () => {
            const stopListen = conn.listen((cmd) => {
                if (isCommandType(cmd, toolsUpdateCommand)) {
                    setTools(cmd.args)
                }
            })
            conn.exec(toolsRequestCommand(NoArg))
            return () => {
                stopListen()
            }
        },
        []
    )
    return {
        tools,
        installTool: (filePath) => {
            conn.exec(installCommand(filePath))
        },
        uninstallTool: (id) => {
            conn.exec(uninstallCommand(id))
        },
        launchTool: (id) => {
            conn.exec(launchCommand(id))
        },
        shutdownTool: (id) => {
            conn.exec(shutdownCommand(id))
        }
    }
}

/******************************************* init variables ******************************************/

const conn = createHostConnection()
