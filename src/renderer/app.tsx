import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Application from './components/Application'

// Create main element
const mainElement = document.createElement('div')
mainElement.id = 'root'
document.body.appendChild(mainElement)

// Render components
const render = (Component: React.ComponentType) => {
    ReactDOM.render(
        // tslint:disable-next-line: jsx-wrap-multiline
        <AppContainer>
            <Component />
        </AppContainer>,
        mainElement
    )
}

render(Application)
