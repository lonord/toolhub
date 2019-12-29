import '../fonts/fonts.css'

import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import TabsWindow from './TabsWindow'

const useStyles = makeStyles({
    '@global': {
        html: {
            height: '100%'
        },
        body: {
            height: '100%'
        },
        '#root': {
            height: '100%'
        }
    }
})

const theme = createMuiTheme()

const Application = () => {
    useStyles()
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box height="100%">
                <TabsWindow />
            </Box>
        </ThemeProvider>
    )
}

export default hot(Application)
