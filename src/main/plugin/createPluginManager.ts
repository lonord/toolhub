import { Plugin, PluginRunnerBridge, BinaryExec, JavaExec, NodeExec } from './Plugin'
import { dir } from 'tmp'
import * as unzip from 'unzip'
import { createReadStream, copy, ensureDir, remove, readFile } from 'fs-extra'
import { extname, join } from 'path'
import { getToolDir, getToolList } from '../app/env'
import { safeLoad } from 'js-yaml'
import { isString, isObject, isArray } from 'util'
import { platform } from 'os'

const PLATFORM = platform()
const PLUGIN_METADATA = 'metadata.yml'

export interface PluginManager {
    install(pkgPath: string): Promise<void>
    uninstall(id: string): Promise<void>
    readPluginList(): Promise<Plugin[]>
    readPlugin(id: string): Promise<Plugin>
    injectPluginRunnerBridge(rb: PluginRunnerBridge): void
}

const createPluginManager = () => {
    let runnerBridge: PluginRunnerBridge
    return {
        install: pkgPath => handleInstall(pkgPath, runnerBridge),
        uninstall: id => handleUninstall(id, runnerBridge),
        readPluginList: () => handleReadPlugins(),
        readPlugin: id => handleReadPlugin(id),
        injectPluginRunnerBridge: rb => runnerBridge = rb
    } as PluginManager
}

export default createPluginManager

const handleInstall = async (pkg: string, runnerBridge: PluginRunnerBridge) => {
    if (extname(pkg).toLocaleLowerCase() !== '.zip') {
        throw new Error(`invalid package ${pkg}`)
    }
    const [tmpDir, clearTmpDir] = await new Promise<[string, () => void]>((resolve, reject) => {
        dir({ mode: 0o755, prefix: 'toolhubTmpToolPkg_' }, (err, name, clear) => {
            if (err) {
                reject(err)
            } else {
                resolve([name, clear])
            }
        })
    })
    try {
        await unpack(pkg, tmpDir)
        const id = await verifyAndReadPkg(tmpDir)
        if (runnerBridge.isRunning(id)) {
            throw new Error('update running plugin')
        }
        await copyPkg(tmpDir, id)
    } finally {
        clearTmpDir()
    }
}

const handleUninstall = async (id: string, runnerBridge: PluginRunnerBridge) => {
    if (runnerBridge.isRunning(id)) {
        throw new Error('remove running plugin')
    }
    await remove(getToolDir(id))
}

const handleReadPlugins = async () => {
    const ps: Plugin[] = []
    for (const id of getToolList()) {
        const p = await handleReadPlugin(id)
        ps.push(p)
    }
    return ps
}

const handleReadPlugin = async (id: string) => {
    const p = await loadPluginInfo(getToolDir(id))
    return p
}

const unpack = async (pkg: string, tmpDir: string) => {
    await new Promise((resolve, reject) => {
        const rs = createReadStream(pkg)
        rs.pipe(unzip.Extract({ path: tmpDir })).on('error', (err) => {
            rs.close()
            reject(err)
        }).on('finish', () => resolve())
    })
}

const verifyAndReadPkg = async (tmpDir: string) => {
    const info = await loadPluginInfo(tmpDir)
    return info.id
}

const copyPkg = async (tmpDir: string, id: string) => {
    const dest = getToolDir(id)
    await remove(dest)
    await ensureDir(dest)
    await copy(tmpDir, dest)
}

const loadPluginInfo = async (targetDir: string) => {
    const content = await readFile(join(targetDir, PLUGIN_METADATA), 'utf8')
    const { id, name, icon, version, exec, ...rest } = safeLoad(content)
    if (!id || !isString(id)) {
        throw new Error(`invalid tool plugin with id ${id}`)
    }
    if (!name || !isString(name)) {
        throw new Error(`invalid tool plugin with name ${name}`)
    }
    if (!version || !isString(version)) {
        throw new Error(`invalid tool plugin with version ${version}`)
    }
    const execp = rest[`exec_${PLATFORM}`]
    return {
        id,
        name,
        version,
        icon: icon || '',
        metadata: {
            exec: loadExecInfo(execp || exec)
        }
    } as Plugin
}

const loadExecInfo = (exec: any) => {
    if (!exec || !isObject(exec)) {
        throw new Error(`invalid exec property ${exec}`)
    }
    const type = exec.type
    if (type === 'bin') {
        const bin = exec.bin
        const args = exec.args
        if (!bin || !isString(bin)) {
            throw new Error(`invalid bin property '${bin}' of exec for bin type`)
        }
        if (!args || !isArray(args)) {
            throw new Error(`invalid args property '${args}' of exec for bin type`)
        }
        return {
            type,
            bin,
            args: args.map(a => `${a}`)
        } as BinaryExec
    } else if (type === 'java') {
        const jars = exec.jars
        const mainClass = exec.mainClass
        const vmOption = exec.vmOption
        if (!jars || !isArray(jars)) {
            throw new Error(`invalid jars property '${jars}' of exec for java type`)
        }
        if (!mainClass || !isString(mainClass)) {
            throw new Error(`invalid mainClass property '${mainClass}' of exec for java type`)
        }
        return {
            type,
            jars,
            mainClass,
            vmOption: vmOption || ''
        } as JavaExec
    } else if (type === 'node') {
        const scriptPath = exec.scriptPath
        const args = exec.args
        if (!scriptPath || !isString(scriptPath)) {
            throw new Error(`invalid scriptPath property '${scriptPath}' of exec for node type`)
        }
        if (!args || !isArray(args)) {
            throw new Error(`invalid args property '${args}' of exec for node type`)
        }
        return {
            type,
            scriptPath,
            args: args.map(a => `${a}`)
        } as NodeExec
    } else {
        throw new Error(`invalid exec type ${type}`)
    }
}
