import * as React from 'react'
import Box from '@material-ui/core/Box'
import { useTools, ToolStatus } from '../tools/manager'

const LaunchPad = () => {
    const { tools, installTool, uninstallTool, launchTool } = useTools()
    return (
        <Box flexGrow={1} flexShrink={1}>
            {tools.map(t => (
                <Box key={t.id} onClick={() => toolCanRun(t.status) && launchTool(t.id)}>{t.name}</Box>
            ))}
        </Box>
    )
}

const toolCanRun = (s: ToolStatus) => {
    return s === ToolStatus.STOPPED || s === ToolStatus.STOPPED_WITH_ERROR
}

export default LaunchPad
