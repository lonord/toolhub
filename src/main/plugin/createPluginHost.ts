import createCommand, { ICommand } from '../../common/util/createCommand'
import { SettingProvider } from '../service/createSettingService'
import { FilePathArg, IdArg, ToolStatus } from '../../common/conn'

export interface Plugin {
    id: string
    name: string
    icon: string
    version: string
}

export type ListChangeArg = Readonly<Plugin>[]
export type StatusChangeArg = { id: string, status: ToolStatus }

export const pluginInstallAction = createCommand<FilePathArg>('plugin-install')
export const pluginUninstallAction = createCommand<IdArg>('plugin-uninstall')
export const pluginLaunchAction = createCommand<IdArg>('plugin-launch')
export const pluginShutdownAction = createCommand<IdArg>('plugin-shutdown')
export const pluginListChangeAction = createCommand<ListChangeArg>('plugin-list-change')
export const pluginStatusChangeAction = createCommand<StatusChangeArg>('plugin-status-change')

export type PluginActionHandler = (action: ICommand<any>) => void

export interface PluginHost {
    dispatch: PluginActionHandler
    watch(fn: PluginActionHandler): void
}

const createPluginHost = (settingProvider: SettingProvider) => {
    // TODO
    return {} as PluginHost
}

export default createPluginHost
