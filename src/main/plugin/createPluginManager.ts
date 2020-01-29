import { SettingProvider } from '../service/createSettingService'
import { Plugin } from './Plugin'

export interface PluginManager {
    install(pkgPath: string): Promise<Plugin>
    uninstall(id: string): Promise<void>
    readPluginList(): Promise<Plugin[]>
}

const createPluginManager = (settingProvider: SettingProvider) => {
    // TODO
    return {} as PluginManager
}

export default createPluginManager
