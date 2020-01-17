import createService from '../service/createService'
import { prepareEnv } from './env'

const init = async () => {
    prepareEnv()
    await createService()
}

export default init
