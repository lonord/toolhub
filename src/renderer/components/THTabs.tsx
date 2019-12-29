import * as React from 'react'
import Tabs from '@material-ui/core/Tabs'
import { withStyles } from '@material-ui/core/styles'

const THTabs0 = withStyles({
    root: {
        height: 36,
        minHeight: 36
    }
})(Tabs)

export interface THTabsProps {
    value: number
    onChange(newValue: number): void
    children: React.ReactNode
    className?: string
}

const THTabs = (props: THTabsProps) => {
    const { onChange, ...otherProps } = props
    const onChange0 = (_: any, newValue: number) => onChange(newValue)
    return (
        <THTabs0
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="off"
            {...otherProps}
            onChange={onChange0}
        />
    )
}

export default THTabs
