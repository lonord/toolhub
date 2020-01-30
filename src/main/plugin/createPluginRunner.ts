import { SettingProvider } from '../service/createSettingService'
import { PluginManagerBridge } from './Plugin'

export type PluginDataListener = (id: string, data: string) => void

export interface PluginRunner {
    start(id: string): Promise<void>
    stop(id: string): Promise<void>
    listen(fn: PluginDataListener): void
    send(id: string, data: string): void
    isRunning(id: string): boolean
    injectPluginManagerBridge(mb: PluginManagerBridge): void
}

const createPluginRunner = (settingProvider: SettingProvider) => {
    // TODO
    return {} as PluginRunner
}

export default createPluginRunner