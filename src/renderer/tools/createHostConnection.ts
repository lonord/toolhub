import createCommand, { isCommandType, ICommand } from './createCommand'

export interface InstallArgs {
    filePath: string
}
export interface UninstallArgs {
    id: string
}
export interface LaunchArgs {
    id: string
}
export interface ShutdownArgs {
    id: string
}

export const installCommand = createCommand<InstallArgs>('install')
export const uninstallCommand = createCommand<InstallArgs>('uninstall')
export const launchCommand = createCommand<InstallArgs>('launch')
export const shutdownCommand = createCommand<InstallArgs>('shutdown')

export interface HostConnection {
    exec(cmd: ICommand<any>): Promise<void>
    listen(fn: (cmd: ICommand<any>) => void): () => void
}

export default function createHostConnection(): HostConnection {
    // TODO
    return {} as HostConnection
}
