import { type Comparable, sortedBy } from "$lib/utils/comparisons";

export const ranked = <T extends PropertyKey>(array: T[]) => Object.fromEntries(array.map(
    (item, index) => [item, index + 1]
).toReversed()) as Record<T, number>

export const rankedBy = <T, U extends Comparable & PropertyKey>(
    array: T[], callback: (item: T, index: number, array: T[]) => U
) => ranked(sortedBy(array, callback).map(callback)) as Record<U, number>