import { Setting } from '../../common/setting'

export interface SettingProvider {
    getSetting(): Readonly<Setting>
    watch(fn: (setting: Setting) => void): void
}

export interface SettingService extends SettingProvider {
    updateSetting(s: Partial<Setting>): Promise<void>
}

const createSettingService = () => {
    // TODO
    return {} as SettingService
}

export default createSettingService
