type NotNullComparable = number | string | boolean
export type Comparable = null | undefined | NotNullComparable

const compareStrings = (a: string, b: string) => a.localeCompare(b)
const compareNumbers = (a: number, b: number) => a - b
const compareBooleans = (a: boolean, b: boolean) => a == b ? 0 : a ? 1 : -1
const compare = (a: NotNullComparable, b: NotNullComparable) =>
    typeof a == 'string' && typeof b == 'string' ? compareStrings(a, b)
        : typeof a == 'number' && typeof b == 'number' ? compareNumbers(a, b)
            : typeof a == 'boolean' && typeof b == 'boolean' ? compareBooleans(a, b)
                : 0
const compareNullable = (a: Comparable, b: Comparable) => a == null
        ? b == null ? 0 : Number.POSITIVE_INFINITY
        : b == null ? Number.NEGATIVE_INFINITY : compare(a, b)

export const sortedBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) => array
    .map((item, index, array) => ({ item, sort: callback(item, index, array) }))
    .toSorted((a, b) => compareNullable(a.sort, b.sort))
    .map(({ item }) => item);
export const sortedByDescending = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) => array
    .map((item, index, array) => ({ item, sort: callback(item, index, array) }))
    .toSorted((a, b) => compareNullable(b.sort, a.sort))
    .map(({ item }) => item);

export const maxBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) =>
    sortedBy(array, callback).at(-1)
export const minBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) =>
    sortedBy(array, callback)[0]