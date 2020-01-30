export interface BinaryExec {
    type: 'bin'
    bin: string
    args: string[]
}

export interface JavaExec {
    type: 'java'
    jars: string[]
    mainClass: string
    vmOption?: string
}

export interface NodeExec {
    type: 'node'
    scriptPath: string
    args: string[]
}

export type PluginExec = BinaryExec | JavaExec | NodeExec

export interface PluginMetadata {
    exec: PluginExec
}

export interface Plugin {
    id: string
    name: string
    icon: string
    version: string
    metadata: PluginMetadata
}

export interface PluginRunnerBridge {
    isRunning(id: string): boolean
}

export interface PluginManagerBridge {
    readPlugin(id: string): Promise<Plugin>
}

export function isBinExec(exec: PluginExec): exec is BinaryExec {
    return exec.type === 'bin'
}

export function isJavaExec(exec: PluginExec): exec is JavaExec {
    return exec.type === 'java'
}

export function isNodeExec(exec: PluginExec): exec is NodeExec {
    return exec.type === 'node'
}
