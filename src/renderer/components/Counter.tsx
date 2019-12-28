import * as React from 'react'

const { useState } = React

interface Props {
    value: number

    incrementValue: () => any
    decrementValue: () => any
}

const CounterWidget: React.FunctionComponent<Props> = ({ value, incrementValue, decrementValue }) => (
    <div className="counter">
        <p id="counter-value">Current value: {value}</p>
        <p>
            <button id="increment" onClick={incrementValue}>
                Increment
            </button>
            <button id="decrement" onClick={decrementValue}>
                Decrement
            </button>
        </p>
    </div>
)

const Counter = () => {
    const [value, setValue] = useState(0)
    const incrementValue = () => setValue(value + 1)
    const decrementValue = () => setValue(value - 1)
    return (
        <CounterWidget value={value} incrementValue={incrementValue} decrementValue={decrementValue}/>
    )
}

export default Counter
