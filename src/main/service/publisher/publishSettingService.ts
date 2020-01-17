import { RPCServer } from '../createRPCServer'
import { SettingProvider } from '../createSettingService'
import { settingRequestCommand, settingUpdateCommand } from '../../../common/conn'
import { isCommandType } from '../../../common/util/createCommand'

const publishSettingService = (rpc: RPCServer, ss: SettingProvider) => {
    rpc.listen(
        (reply, cmd) => {
            if (isCommandType(cmd, settingRequestCommand)) {
                reply(settingUpdateCommand(ss.getSetting()))
            }
        },
        settingRequestCommand
    )
    ss.watch((s) => {
        rpc.push(settingUpdateCommand(s))
    })
}

export default publishSettingService
