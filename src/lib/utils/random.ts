export const shuffled = <T>(array: T[], random: () => number = Math.random): T[] => array
    .map(value => ({ value, sort: random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

export const randomChar = (random: () => number = Math.random) =>
    (random().toString(36)[2] || '0').toUpperCase()