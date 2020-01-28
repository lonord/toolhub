import { RPCServer } from '../createRPCServer'
import { SettingService } from '../createSettingService'
import { settingRequestCommand, settingUpdateCommand, settingModifyCommand } from '../../../common/conn'
import { isCommandType } from '../../../common/util/createCommand'

const publishSettingService = (rpc: RPCServer, ss: SettingService) => {
    rpc.listen(
        (reply, cmd) => {
            if (isCommandType(cmd, settingRequestCommand)) {
                reply(settingUpdateCommand(ss.getSetting()))
            } else if (isCommandType(cmd, settingModifyCommand)) {
                ss.updateSetting(cmd.args)
            }
        },
        settingRequestCommand,
        settingModifyCommand
    )
    ss.watch((s) => {
        rpc.push(settingUpdateCommand(s))
    })
}

export default publishSettingService
