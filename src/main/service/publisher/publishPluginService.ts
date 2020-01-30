import { RPCServer } from '../createRPCServer'
import { Plugin } from '../../plugin/Plugin'
import {
    PluginHost,
    pluginInstallAction,
    pluginUninstallAction,
    pluginLaunchAction,
    pluginShutdownAction,
    pluginDataSubmitAction,
    pluginListChangeAction,
    pluginStatusChangeAction,
    pluginDataUpdateAction,
    pluginInstallStatusAction,
    pluginUninstallStatusAction
} from '../../plugin/createPluginHost'
import {
    MutableTool,
    installCommand,
    uninstallCommand,
    launchCommand,
    shutdownCommand,
    toolsRequestCommand,
    toolDataRequestCommand,
    toolDataSubmitCommand,
    toolsUpdateCommand,
    toolDataUpdateCommand,
    ToolStatus,
    installStatusCommand,
    uninstallStatusCommand
} from '../../../common/conn'
import { isCommandType } from '../../../common/util/createCommand'

const publishPluginService = (rpc: RPCServer, host: PluginHost) => {
    const plugins: MutableTool[] = []
    const pluginMap: Map<string, MutableTool> = new Map()
    const dataMap: Map<string, string> = new Map()
    rpc.listen(
        (reply, cmd) => {
            if (isCommandType(cmd, installCommand)) {
                host.dispatch(pluginInstallAction(cmd.args))
            } else if (isCommandType(cmd, uninstallCommand)) {
                host.dispatch(pluginUninstallAction(cmd.args))
            } else if (isCommandType(cmd, launchCommand)) {
                host.dispatch(pluginLaunchAction(cmd.args))
            } else if (isCommandType(cmd, shutdownCommand)) {
                host.dispatch(pluginShutdownAction(cmd.args))
            } else if (isCommandType(cmd, toolsRequestCommand)) {
                reply(toolsUpdateCommand(plugins))
            } else if (isCommandType(cmd, toolDataRequestCommand)) {
                const id = cmd.args
                reply(toolDataUpdateCommand({
                    id,
                    msg: dataMap.get(id) || '{}'
                }))
            } else if (isCommandType(cmd, toolDataSubmitCommand)) {
                host.dispatch(pluginDataSubmitAction(cmd.args))
            }
        },
        installCommand,
        uninstallCommand,
        launchCommand,
        shutdownCommand,
        toolsRequestCommand,
        toolDataRequestCommand,
        toolDataSubmitCommand
    )
    host.watch((cmd) => {
        if (isCommandType(cmd, pluginListChangeAction)) {
            reloadPlugins(cmd.args as Plugin[], plugins, pluginMap, dataMap)
            rpc.push(toolsUpdateCommand(plugins))
        } else if (isCommandType(cmd, pluginStatusChangeAction)) {
            const p = pluginMap.get(cmd.args.id)
            if (p) {
                p.status = cmd.args.status
            } else {
                throw new Error(`unexpected plugin object with id ${cmd.args.id}`)
            }
            rpc.push(toolsUpdateCommand(plugins))
        } else if (isCommandType(cmd, pluginDataUpdateAction)) {
            dataMap.set(cmd.args.id, cmd.args.msg)
            rpc.push(toolDataUpdateCommand(cmd.args))
        } else if (isCommandType(cmd, pluginInstallStatusAction)) {
            rpc.push(installStatusCommand(cmd.args))
        } else if (isCommandType(cmd, pluginUninstallStatusAction)) {
            rpc.push(uninstallStatusCommand(cmd.args))
        }
    })
}

const reloadPlugins = (
    data: Plugin[],
    plugins: MutableTool[],
    pluginMap: Map<string, MutableTool>,
    dataMap: Map<string, string>
) => {
    // clear old items
    const dItems = plugins.splice(0, plugins.length)
    pluginMap.clear()
    // stash ids of removed items
    const removedItems = new Set<string>()
    dItems.forEach(t => removedItems.add(t.id))
    // load plugins
    data.forEach((t) => {
        const { metadata, ...pp } = t
        const tool = {
            ...pp,
            status: ToolStatus.STOPPED
        }
        plugins.push(tool)
        pluginMap.set(t.id, tool)
        removedItems.delete(t.id)
    })
    // remove removed items from dataMap
    removedItems.forEach(id => dataMap.delete(id))
}

export default publishPluginService
