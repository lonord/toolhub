import createRPCServer from './createRPCServer'
import createSettingService from './createSettingService'
import createPluginHost from '../plugin/createPluginHost'
import publishSettingService from './publisher/publishSettingService'
import publishPluginService from './publisher/publishPluginService'

const createService = async () => {
    const rpc = createRPCServer()
    const ss = createSettingService()
    const pluginHost = createPluginHost(ss)
    // publish services
    publishSettingService(rpc, ss)
    publishPluginService(rpc, pluginHost)
}

export default createService
