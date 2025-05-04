/** Největší společný násobek */
export const gcd = (a: number, b: number): number => b == 0 ? a : gcd(b, a % b)
const lcm2 = (a: number, b: number): number => a * b / gcd(a, b)
/** Nejmenší společný dělitel */
export const lcm = (...numbers: number[]) => numbers.reduce(lcm2, 1)

export const round = (n: number, decimalPlaces: number = 2) => Number(n.toFixed(decimalPlaces))