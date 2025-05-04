export const averageBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => number) =>
    array.length == 0 ? undefined : sumBy(array, callback) / array.length;

export const sumBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => number) =>
    array.reduce((sum, item, index, array) => sum + callback(item, index, array), 0);