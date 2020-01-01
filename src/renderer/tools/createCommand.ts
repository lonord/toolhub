export interface ICommand<T> {
    type: string
    args: T
}

export interface ICommandType<T> {
    type: string
    (args: T): ICommand<T>
}

export default function createCommand<T>(type: string): ICommandType<T> {
    return Object.assign(
        (args: T) => ({ type, args }),
        { type }
    )
}

export function isCommandType<T>(args: ICommand<any>, command: ICommandType<T>): args is ICommand<T> {
    return args.type === command.type
}
