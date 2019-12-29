import * as React from 'react'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import * as icons from '@material-ui/icons'
import * as color from 'color'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import CancelRounded from '@material-ui/icons/CancelRounded'
import { Box } from '@material-ui/core'

const { useState } = React

const DefaultIcon = icons.Widgets

const THTab0 = withStyles(theme => ({
    root: {
        height: 36,
        minHeight: 36,
        width: 180,
        '&:hover': {
            background: color(theme.palette.primary.main).alpha(0.2).toString()
        },
        fontSize: '0.8125rem'
    },
    labelIcon: {
        paddingTop: 6
    },
    wrapper: {
        flexDirection: 'row',
        '& > *:first-child': {
            marginBottom: '3px !important',
            marginRight: 2
        },
        justifyContent: 'flex-start'
    },
    selected: {
        background: color(theme.palette.primary.main).alpha(0.1).toString()
    }
}))(Tab)

export interface THTabProps {
    icon: string
    label: string
    onClose?(): void
    onChange?: (event: React.ChangeEvent<{ checked: boolean }>, value: any) => void
    onClick?: React.EventHandler<any>
    selected?: boolean
    value?: any
}

const THTab = (props: THTabProps) => {
    const { icon, label, onClose, ...rest } = props
    const [hover, setHover] = useState(false)
    const Icon = (icons as any)[icon] || DefaultIcon
    const onClose0 = onClose && ((e: React.MouseEvent) => {
        e.stopPropagation()
        onClose()
    })
    const mouseEnter = () => setHover(true)
    const mouseLeave = () => setHover(false)
    const closeButtonEl = onClose0 && (
        <IconButton size="small" component="span" onClick={onClose0}>
            <CancelRounded fontSize="inherit"/>
        </IconButton>
    )
    const labelEl = (
        <Box
            component="span"
            overflow="hidden"
            display="inline-flex"
            flexDirection="row"
            alignItems="center"
            flexGrow={1}
            flexShrink={1}
        >
            <Box flexShrink={1} flexGrow={1} clone={true} textAlign="left">
                <Typography gutterBottom={false} noWrap={true} variant="inherit">{label}</Typography>
            </Box>
            {hover ? <span>{closeButtonEl}</span> : null}
        </Box>
    )
    return (
        <Tooltip title={label} enterDelay={1000} >
            <THTab0
                {...rest}
                icon={<Icon fontSize="small" />}
                label={labelEl}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
            />
        </Tooltip>
    )
}

export default THTab
