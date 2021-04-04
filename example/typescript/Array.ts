export const first = <T>(arr: Array<T>|null|undefined) => arr?.length || 0 > 0 ? arr![0] : null
export const last = <T>(arr: Array<T>|null|undefined) => arr?.length || 0 > 0 ? arr![arr!.length-1] : null
