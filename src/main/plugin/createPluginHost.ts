import createCommand, { ICommand, isCommandType } from '../../common/util/createCommand'
import { SettingProvider } from '../service/createSettingService'
import { FilePathArg, IdArg, ToolStatus, IdMsgArg, InstallStatusArg, InstallStatus, UninstallStatusArg } from '../../common/conn'
import { Plugin } from './Plugin'
import createPluginManager from './createPluginManager'
import createPluginRunner from './createPluginRunner'

export type ListChangeArg = Plugin[]
export type StatusChangeArg = { id: string, status: ToolStatus }

export const pluginInstallAction = createCommand<FilePathArg>('plugin-install')
export const pluginInstallStatusAction = createCommand<InstallStatusArg>('plugin-install-status')
export const pluginUninstallAction = createCommand<IdArg>('plugin-uninstall')
export const pluginUninstallStatusAction = createCommand<UninstallStatusArg>('plugin-uninstall-status')
export const pluginLaunchAction = createCommand<IdArg>('plugin-launch')
export const pluginShutdownAction = createCommand<IdArg>('plugin-shutdown')
export const pluginListChangeAction = createCommand<ListChangeArg>('plugin-list-change')
export const pluginStatusChangeAction = createCommand<StatusChangeArg>('plugin-status-change')
export const pluginDataUpdateAction = createCommand<IdMsgArg>('plugin-data-update')
export const pluginDataSubmitAction = createCommand<IdMsgArg>('plugin-data-submit')

export type PluginActionHandler = (action: ICommand<any>) => void

export interface PluginHost {
    dispatch: PluginActionHandler
    watch(fn: PluginActionHandler): void
}

const createPluginHost = (settingProvider: SettingProvider) => {
    const mgr = createPluginManager(settingProvider)
    const runner = createPluginRunner(settingProvider)

    const watchers: PluginActionHandler[] = []
    const send = (cmd: ICommand<any>) => watchers.forEach(w => w(cmd))

    runner.listen((id, msg) => {
        send(pluginDataUpdateAction({
            id,
            msg
        }))
    })
    return {
        dispatch: (cmd) => {
            if (isCommandType(cmd, pluginInstallAction)) {
                send(pluginInstallStatusAction({
                    pkgPath: cmd.args,
                    status: InstallStatus.INSTALLING
                }))
                mgr.install(cmd.args).then(() => send(pluginInstallStatusAction({
                    pkgPath: cmd.args,
                    status: InstallStatus.SUCCEED
                }))).catch(err => send(pluginInstallStatusAction({
                    pkgPath: cmd.args,
                    status: InstallStatus.FAILED,
                    msg: err.message || `${err}`
                }))).then(() => mgr.readPluginList()).then(ps => send(pluginListChangeAction(ps)))
            } else if (isCommandType(cmd, pluginUninstallAction)) {
                send(pluginUninstallStatusAction({
                    id: cmd.args,
                    status: InstallStatus.INSTALLING
                }))
                mgr.uninstall(cmd.args).then(() => send(pluginUninstallStatusAction({
                    id: cmd.args,
                    status: InstallStatus.SUCCEED
                }))).catch(err => send(pluginUninstallStatusAction({
                    id: cmd.args,
                    status: InstallStatus.FAILED,
                    msg: err.message || `${err}`
                }))).then(() => mgr.readPluginList()).then(ps => send(pluginListChangeAction(ps)))
            } else if (isCommandType(cmd, pluginLaunchAction)) {
                send(pluginStatusChangeAction({
                    id: cmd.args,
                    status: ToolStatus.STARTING
                }))
                runner.start(cmd.args).then(() => send(pluginStatusChangeAction({
                    id: cmd.args,
                    status: ToolStatus.RUNNING
                }))).catch(() => send(pluginStatusChangeAction({
                    id: cmd.args,
                    status: ToolStatus.STOPPED
                })))
            } else if (isCommandType(cmd, pluginShutdownAction)) {
                send(pluginStatusChangeAction({
                    id: cmd.args,
                    status: ToolStatus.STOPPING
                }))
                runner.stop(cmd.args).then(() => send(pluginStatusChangeAction({
                    id: cmd.args,
                    status: ToolStatus.STOPPED
                }))).catch(() => send(pluginStatusChangeAction({
                    id: cmd.args,
                    status: ToolStatus.RUNNING
                })))
            } else if (isCommandType(cmd, pluginDataSubmitAction)) {
                runner.send(cmd.args.id, cmd.args.msg)
            }
        },
        watch: fn => watchers.push(fn)
    } as PluginHost
}

export default createPluginHost
