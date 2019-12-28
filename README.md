# electron-react-typescript

### A Boilerplate for an Easy Start with TypeScript, React, and Electron.

[Electron](https://electronjs.org/) application boilerplate based on [React](https://reactjs.org/), [Redux](https://redux.js.org/), and [Webpack](https://webpack.js.org/) for rapid application development using [TypeScript](https://www.typescriptlang.org/).

## Install
Clone the repository with Git:

```bash
git clone --depth=1 git@github.com:lonord/electron-react-typescript.git <your-project-name>
```

And then install the dependencies:

```bash
cd <your-project-name>
npm install
```

## Usage
Both processes have to be started **simultaneously** in different console tabs:

```bash
npm run start-renderer-dev
npm run start-main-dev
```

This will start the application with hot-reload so you can instantly start developing your application.

You can also run do the following to start both in a single process:

```bash
npm run start-dev
```

## Packaging
We use [Electron builder](https://www.electron.build/) to build and package the application. By default you can run the following to package for your current platform:

```bash
npm run dist
```

This will create a installer for your platform in the `releases` folder.

You can make builds for specific platforms (or multiple platforms) by using the options found [here](https://www.electron.build/cli). E.g. building for all platforms (Windows, Mac, Linux):

```bash
npm run dist -- -mwl
```

## About this project
This project was set up from scratch but is heavily influenced by the [Electron React Boilerplate project](https://github.com/chentsulin/electron-react-boilerplate) and [React Redux TypeScript guide](https://github.com/piotrwitek/react-redux-typescript-guide).

## License
MIT © [R. Franken](https://github.com/Robinfr)
