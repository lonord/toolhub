import { join } from 'path'
import { homedir } from 'os'
import { ensureDirSync, existsSync, writeFileSync, readdirSync } from 'fs-extra'

const LOG_DIR_NAME = 'logs'
const LOG_OUT_FILE = 'stdout.log'
const LOG_ERR_FILE = 'stderr.log'
const ENV_DIR_NAME = '.toolhub'
const CONF_DIR_NAME = 'conf'
const CONF_FILE_NAME = 'toolhub.json'
const TOOLS_DIR_NAME = 'tools'

const ctx = {
    envDir: '',
    confPath: '',
    toolsDir: '',
    logsDir: ''
}

export const prepareEnv = () => {
    // ensure envDir
    ctx.envDir = join(homedir(), ENV_DIR_NAME)
    ensureDirSync(ctx.envDir)
    // ensure confDir and confPath
    const confDir = join(ctx.envDir, CONF_DIR_NAME)
    ensureDirSync(confDir)
    ctx.confPath = join(confDir, CONF_FILE_NAME)
    if (!existsSync(ctx.confPath)) {
        writeFileSync(ctx.confPath, '{}')
    }
    // ensure toolsDir
    ctx.toolsDir = join(ctx.envDir, TOOLS_DIR_NAME)
    ensureDirSync(ctx.toolsDir)
    // ensure logsDir
    ctx.logsDir = join(ctx.envDir, LOG_DIR_NAME)
    ensureDirSync(ctx.logsDir)
}

export const getEnvDir = () => ctx.envDir

export const getConfPath = () => ctx.confPath

export const getToolDir = (id: string) => join(ctx.toolsDir, id)

export const getToolList = () => readdirSync(ctx.toolsDir, { withFileTypes: true })
    .filter(f => f.isDirectory())
    .map(f => f.name)

export const ensureAndGetToolOutLogFile = (id: string) => {
    const p = join(ctx.logsDir, id, LOG_OUT_FILE)
    ensureDirSync(p)
    return p
}

export const ensureAndGetToolErrLogFile = (id: string) => {
    const p = join(ctx.logsDir, id, LOG_ERR_FILE)
    ensureDirSync(p)
    return p
}
