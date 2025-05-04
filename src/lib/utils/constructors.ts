export function range(startInclusive: number, endExclusive: number): number[];
export function range(endExclusive: number): number[];
export function range(p0: number, p1?: number): number[] {
    const start = p1 == undefined ? 0 : p0
    const end = p1 == undefined ? p0 : p1
    return newArray(end - start, i => start + i)
}

export const arrayOf = <T>(size: number, value: T) => newArray(size, () => value);
export const newArray = <T>(size: number, filler: (index: number) => T) =>
    Array.from(Array(size), (_, i) => filler(i));

export const newString = (count: number, filler: (index: number) => string) => newArray(count, filler).join('')
export const stringOf = (count: number, value: string) => arrayOf(count, value).join('')