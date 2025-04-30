import seedrandom from "seedrandom";
import {type Class, type Rating, type Student} from "$lib/database";
import database from "$lib/database/supabase";

const throwExpr = (x: any): never => {
    throw x;
}

export const isAdmin = (email: string) => email.endsWith('@gymceska.cz') || email == 'rblaha15@student.gymceska.cz'

export type Data = {
    myself: Student
    myClass: Class
    students: Student[]
    alreadyRated: boolean
}

export const allData = async (email: string): Promise<Data | undefined> => {
    if (!email.endsWith('@student.gymceska.cz')) return undefined

    const myself = await database.getStudentByEmail(email)

    return {
        myself: myself,
        myClass: await database.getMyClass(myself.class),
        students: await database.getStudentsOfClass(myself.class),
        alreadyRated: await database.getAlreadyRated(myself.id),
    };
}

export const shuffled = <T>(array: T[], random: () => number = Math.random): T[] => array
    .map(value => ({value, sort: random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)

export const getRatingGroups = (myself: Student, students: Student[], maxGroupSize: number): Student[][] => {
    const classmates = students.toSpliced(students.findIndex(s => s.id == myself.id), 1);

    const random = seedrandom(`${myself.id}`)
    const shuffledStudents = shuffled(classmates, random)
    const orderedStudents = [
        myself,
        ...sortedBy(shuffledStudents, s => s.is_girl != myself.is_girl),
    ];

    const studentCount = students.length;
    const chunkCount = Math.ceil(studentCount / maxGroupSize);
    const chunkSize = Math.ceil(studentCount / chunkCount);
    return chunked(orderedStudents, chunkSize)
}

export const defaultRating = (by: number, about: number): Rating => ({
    by, about,
    influence: -1, sympathy: -1, reasoning: ''
})

export const validateRating = (r: Rating, phase: Phase) =>
    r.influence != -1 && (r.sympathy != -1 || phase == 'influence')


type Indexes = {
    /** Index vlivu */
    influence: number | undefined,
    /** Index obliby */
    popularity: number | undefined,
    /** Index náklonnosti */
    affection: number | undefined,
    /** Index ovlivnitelnosti */
    influenceability: number | undefined,
    /** Celkové hodnocení */
    overall: number | undefined,
};

export type StudentScore = Student & Indexes;
export type StudentScoreWithRanks = Student & {
    [I in keyof Indexes]: { value: number, rank: number, of: number } | undefined
};

export const getStudentsScores = (
    students: Student[],
    ratings: RatingWithStudents[],
): StudentScore[] => students.map(s =>
    getStudentScore(s, ratings.filter(r => r.about.id == s.id), ratings.filter(r => r.by.id == s.id))
);

export const getStudentScore = (
    student: Student,
    ratingsAbout: Omit<Rating, "by" | "about">[],
    ratingsBy: Omit<Rating, "by" | "about">[]
): StudentScore => {
    const influence = ratingsAbout.length == 0 ? undefined
        : Number(averageBy(ratingsAbout, r => r.influence).toFixed(2));
    const popularity = ratingsAbout.length == 0 ? undefined
        : Number(averageBy(ratingsAbout, r => r.sympathy).toFixed(2));
    const affection = ratingsBy.length == 0 ? undefined
        : Number(averageBy(ratingsBy, r => r.sympathy).toFixed(2));
    const influenceability = ratingsBy.length == 0 ? undefined
        : Number(averageBy(ratingsBy, r => r.influence).toFixed(2));
    return ({
        ...student, influence, popularity, affection, influenceability,
        overall: influence == undefined || popularity == undefined ? undefined
            : (influence + popularity) / 2
    });
}

export const getClassScore = (
    scores: StudentScore[],
): Indexes => {
    const influence = scores.length == 0 ? undefined : Number(averageBy(
        scores.filter(s => s.influence), s => s.influence!
    ).toFixed(2));
    const popularity = scores.length == 0 ? undefined : Number(averageBy(
        scores.filter(s => s.popularity), s => s.popularity!
    ).toFixed(2));
    const affection = scores.length == 0 ? undefined : Number(averageBy(
        scores.filter(s => s.affection), s => s.affection!
    ).toFixed(2));
    const influenceability = scores.length == 0 ? undefined : Number(averageBy(
        scores.filter(s => s.influenceability), s => s.influenceability!
    ).toFixed(2));
    return ({
        influence, popularity, affection, influenceability,
        overall: influence == undefined || popularity == undefined ? undefined
            : (influence + popularity) / 2
    });
}

export type RatingWithStudents = Omit<Rating, 'by' | 'about'> & { by: Student, about: Student };

export const averageBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => number) =>
    array.length == 0 ? throwExpr(RangeError('Array is empty'))
        : sumBy(array, callback) / array.length;

export const sumBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => number) =>
    array.reduce((sum, item, index, array) => sum + callback(item, index, array), 0);

type NotNullComparable = number | string | boolean
export type Comparable = null | undefined | NotNullComparable

const compare = (a: NotNullComparable, b: NotNullComparable) =>
    typeof a == 'string' && typeof b == 'string' ? compareStrings(a, b)
        : typeof a == 'number' && typeof b == 'number' ? compareNumbers(a, b)
            : typeof a == 'boolean' && typeof b == 'boolean' ? compareBooleans(a, b)
                : 0
const compareStrings = (a: string, b: string) => a.localeCompare(b)
const compareNumbers = (a: number, b: number) => a - b
const compareBooleans = (a: boolean, b: boolean) => a == b ? 0 : a ? 1 : -1
const compareNullable = (a: Comparable, b: Comparable) => a == null
    ? b == null ? 0 : Number.POSITIVE_INFINITY
    : b == null ? Number.NEGATIVE_INFINITY : compare(a, b)

export const sortedBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) => array
    .map((item, index, array) => ({item, sort: callback(item, index, array)}))
    .toSorted((a, b) => compareNullable(a.sort, b.sort))
    .map(({item}) => item);

export const sortedByDescending = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) => array
    .map((item, index, array) => ({item, sort: callback(item, index, array)}))
    .toSorted((a, b) => compareNullable(b.sort, a.sort))
    .map(({item}) => item);

export const ranked = <T extends PropertyKey>(array: T[]) => Object.fromEntries(array.map(
    (item, index) => [item, index + 1]
).toReversed()) as Record<T, number>

export const rankedBy = <T, U extends Comparable & PropertyKey>(
    array: T[], callback: (item: T, index: number, array: T[]) => U
) => ranked(sortedBy(array, callback).map(callback)) as Record<U, number>

declare global {
    interface ObjectConstructor {
        fromEntries<K extends PropertyKey, V>(
            entries: [K, V][] | readonly [K, V][]
        ): {
            [Key in K]: V
        };
    }
}

export const chunked = <T>(arr: T[], size: number): T[][] => windowed(arr, size, size, true);

export const windowed = <T>(arr: T[], size: number, step: number = 1, partialWindows: boolean = false): T[][] => {
    if (size <= 0 || step <= 0) throw new RangeError("Size and step bust be positive");

    const thisSize = arr.length;
    const resultCapacity = Math.floor(thisSize / step) + (thisSize % step == 0 ? 0 : 1);
    const result = Array<T[]>(resultCapacity);
    let index = 0;
    let arrayIndex = 0;
    while (0 <= index && index < thisSize) {
        const windowSize = Math.min(size, thisSize - index);
        if (windowSize < size && !partialWindows) break;
        result[arrayIndex++] = Array.from(Array(windowSize), (_, i) => arr[i + index]);
        index += step;
    }
    return result;
};

/** Největší společný násobek */
export const gcd = (a: number, b: number): number => b == 0 ? a : gcd(b, a % b)
const lcm2 = (a: number, b: number): number => a * b / gcd(a, b)
/** Nejmenší společný dělitel */
export const lcm = (...numbers: number[]) => numbers.reduce(lcm2, 1)