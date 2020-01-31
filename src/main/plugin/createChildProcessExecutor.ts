import { Plugin, BinaryExec, isBinExec, JavaExec, NodeExec, isJavaExec, isNodeExec } from './Plugin'
import { ChildProcess, spawn, fork } from 'child_process'
import { getToolDir } from '../app/env'
import { Stream } from 'stream'
import { SettingProvider } from '../service/createSettingService'
import { platform } from 'os'

const isWindows = platform() === 'win32'

export type ChildProcessExecutor = (
    env: { [k: string]: string },
    stdout: Stream,
    stderr: Stream
) => ChildProcess

const createChildProcessExecutor = (p: Plugin, setting: SettingProvider) => {
    const cwd = getToolDir(p.id)
    const exec = p.metadata.exec
    if (isBinExec(exec)) {
        return createBinExecutor(cwd, exec, setting)
    }
    if (isJavaExec(exec)) {
        return createJavaExecutor(cwd, exec, setting)
    }
    if (isNodeExec(exec)) {
        return createNodeExecutor(cwd, exec, setting)
    }
    throw new Error(`invalid exec ${exec}`)
}

export default createChildProcessExecutor

function createBinExecutor(cwd: string, exec: BinaryExec, setting: SettingProvider): ChildProcessExecutor {
    return (env, stdout, stderr) => spawn(exec.bin, exec.args, {
        cwd,
        env,
        stdio: ['ignore', stdout, stderr]
    })
}

function createJavaExecutor(cwd: string, exec: JavaExec, setting: SettingProvider): ChildProcessExecutor {
    const cpStr = exec.jars.join(isWindows ? ';' : ':')
    const argsStr = `-cp ${cpStr} ${exec.vmOption || ''} ${exec.mainClass}`
    return (env, stdout, stderr) => spawn(
        setting.getSetting().javaBinPath,
        argsStr.split(' ').filter(a => !!a),
        {
            cwd,
            env,
            stdio: ['ignore', stdout, stderr]
        }
    )
}

function createNodeExecutor(cwd: string, exec: NodeExec, setting: SettingProvider): ChildProcessExecutor {
    return (env, stdout, stderr) => fork(exec.scriptPath, exec.args, {
        cwd,
        env,
        stdio: ['ignore', stdout, stderr]
    })
}
