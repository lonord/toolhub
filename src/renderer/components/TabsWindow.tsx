import * as React from 'react'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import MoreVert from '@material-ui/icons/MoreVert'
import THTabs from './THTabs'
import THTab from './THTab'
import THIconTab from './THIconTab'
import LaunchPad from './LaunchPad'
import { useTools, ToolStatus } from '../tools/manager'

const { useState, useMemo } = React

const TabsWindow = () => {
    const { tools, shutdownTool } = useTools()
    const runningTools = useMemo(
        () => tools.filter(t =>
            t.status === ToolStatus.RUNNING
            || t.status === ToolStatus.STARTING
            || t.status === ToolStatus.STARTED_WITH_ERROR
        ),
        [tools]
    )
    const [tabIndex, setTabIndex] = useState(0)
    const closeClicked = (id: string) => {
        shutdownTool(id)
        setTabIndex(0)
    }
    return (
        <Box height="100%" display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" borderBottom="1px solid #e0e0e0" >
                <Box flexGrow={1} flexShrink={1} clone={true}>
                    <THTabs value={tabIndex} onChange={setTabIndex}>
                        <THIconTab icon="Home" />
                        {runningTools.map(t => (
                            <THTab key={t.id} icon={t.icon} label={t.name} onClose={() => closeClicked(t.id)}/>
                        ))}
                    </THTabs>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" px={1}>
                    <IconButton size="small">
                        <MoreVert fontSize="inherit"/>
                    </IconButton>
                </Box>
            </Box>
            <Box display="flex" flexGrow={1} flexShrink={1}>
                {tabIndex === 0
                    ? (
                        <LaunchPad />
                    )
                    : (
                        <div>content</div>
                    )}
            </Box>
        </Box>
    )
}

export default TabsWindow
