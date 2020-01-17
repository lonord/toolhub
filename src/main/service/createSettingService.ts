import { existsSync } from 'fs'
import { join } from 'path'
import { platform } from 'os'
import * as which from 'which'
import { Setting } from '../../common/setting'
import { readJSONSync, writeJSONSync } from 'fs-extra'
import { getConfPath } from '../app/env'

const isWindows = platform() === 'win32'
const javaExecName = isWindows ? 'java.exe' : 'java'

export type WatchListener = (setting: Setting) => void

export interface SettingProvider {
    getSetting(): Readonly<Setting>
    watch(fn: WatchListener): void
}

export interface SettingService extends SettingProvider {
    updateSetting(s: Partial<Setting>): Promise<void>
}

const createSettingService = () => {
    let s = readSettingFromFs()
    fixDefault(s)
    const listeners = [] as WatchListener[]
    return {
        getSetting: () => s,
        watch: (fn) => {
            listeners.push(fn)
        },
        updateSetting: (ss) => {
            s = {
                ...s,
                ...ss
            }
            writeJSONSync(getConfPath(), s, { spaces: 4 })
            listeners.forEach((l) => {
                l(s)
            })
        }
    } as SettingService
}

const readSettingFromFs = () => {
    let cfg: any = {}
    try {
        cfg = readJSONSync(getConfPath())
    } catch (ignore) {
    }
    return cfg as Setting
}

const fixDefault = (s: Setting) => {
    if (!s.javaBinPath) {
        const javaHome = process.env.JAVA_HOME
        if (javaHome) {
            let p = join(javaHome, 'bin', javaExecName)
            if (existsSync(p)) {
                s.javaBinPath = p
            } else {
                p = join(javaHome, 'jre', 'bin', javaExecName)
                if (existsSync(p)) {
                    s.javaBinPath = p
                }
            }
        }
        if (!s.javaBinPath) {
            s.javaBinPath = which.sync('java', { nothrow: true }) || ''
        }
    }
}

export default createSettingService
