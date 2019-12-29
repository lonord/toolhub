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

const DefaultIcon = icons.Widgets

const THIconTab0 = withStyles(theme => ({
    root: {
        height: 36,
        minHeight: 36,
        minWidth: 48,
        maxWidth: 48,
        '&:hover': {
            background: color(theme.palette.primary.main).alpha(0.2).toString()
        }
    },
    selected: {
        background: color(theme.palette.primary.main).alpha(0.1).toString()
    }
}))(Tab)

export interface THIconTabProps {
    icon: string
    onChange?: (event: React.ChangeEvent<{ checked: boolean }>, value: any) => void
    onClick?: React.EventHandler<any>
    selected?: boolean
    value?: any
}

const THIconTab = (props: THIconTabProps) => {
    const { icon, ...rest } = props
    const Icon = (icons as any)[icon] || DefaultIcon
    return (
        <THIconTab0 {...rest} icon={<Icon fontSize="small" />} />
    )
}

export default THIconTab
