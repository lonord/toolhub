import * as React from 'react'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import MoreVert from '@material-ui/icons/MoreVert'
import THTabs from './THTabs'
import THTab from './THTab'
import THIconTab from './THIconTab'

const { useState } = React

const TabsWindow = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const closeFn = () => {
        console.log('close')
    }
    return (
        <Box height="100%" display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" borderBottom="1px solid #e0e0e0" >
                <Box flexGrow={1} flexShrink={1} clone={true}>
                    <THTabs value={tabIndex} onChange={setTabIndex}>
                        <THIconTab icon="Home" />
                        <THIconTab icon="invalid" />
                        <THTab icon="Add" label="tab3" onClose={closeFn}/>
                        <THTab icon="Settings" label="tab33333333333333333333333" onClose={closeFn}/>
                    </THTabs>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" px={1}>
                    <IconButton size="small">
                        <MoreVert fontSize="inherit"/>
                    </IconButton>
                </Box>
            </Box>
            <Box flexGrow={1} flexShrink={1}>
                content
            </Box>
        </Box>
    )
}

export default TabsWindow
