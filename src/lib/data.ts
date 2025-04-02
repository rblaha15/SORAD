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

const shuffled = <T>(array: T[], random: () => number): T[] => array
    .map(value => ({value, sort: random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)

export const getRatingGroups = (myself: Student, students: Student[]): Student[][] => {
    const classmates = students.toSpliced(students.findIndex(s => s.id == myself.id), 1);

    const random = seedrandom(`${myself.id}`)

    const girls = shuffled(classmates?.filter(student => student.is_girl), random)
    const boys = shuffled(classmates?.filter(student => !student.is_girl), random)

    const girlGroups = [
        girls?.slice(0, girls?.length / 2),
        girls?.slice(girls?.length / 2),
    ]
    const boyGroups = [
        boys?.slice(0, boys?.length / 2),
        boys?.slice(boys?.length / 2),
    ];

    const groups = myself.is_girl ? [...girlGroups, ...boyGroups] : [...boyGroups, ...girlGroups];
    groups[0] = [myself, ...groups[0]];
    return groups;
}

export const defaultRating = (by: number, about: number): Rating => ({
    by, about,
    influence: -1, sympathy: -1, reasoning: ''
})

export const validateRating = (r: Rating) =>
    r.influence != -1 && r.sympathy != -1 &&
    ((r.influence != 0 && r.sympathy != 4) || r.reasoning)


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

export type RatingWithStudents = Omit<Rating, 'by' | 'about'> & { by: Student, about: Student };

export const averageBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => number) =>
    array.length == 0 ? throwExpr(RangeError('Array is empty'))
        : sumBy(array, callback) / array.length;

export const sumBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => number) =>
    array.reduce((sum, item, index, array) => sum + callback(item, index, array), 0);

type NotNullComparable = number | string
export type Comparable = null | undefined | NotNullComparable

const compare = (a: NotNullComparable, b: NotNullComparable) =>
    typeof a == 'string' && typeof b == 'string' ? compareStrings(a, b)
        : typeof a == 'number' && typeof b == 'number' ? compareNumbers(a, b)
            : 0
const compareStrings = (a: string, b: string) => a.localeCompare(b)
const compareNumbers = (a: number, b: number) => a - b
const compareNullable = (a: Comparable, b: Comparable) => a == null
    ? b == null ? 0 : Number.POSITIVE_INFINITY
    : b == null ? Number.NEGATIVE_INFINITY : compare(a, b)

export const sortBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) => array
    .map((item, index, array) => ({item, sort: callback(item, index, array)}))
    .toSorted((a, b) => compareNullable(a.sort, b.sort))
    .map(({item}) => item);

export const sortByDescending = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) => array
    .map((item, index, array) => ({item, sort: callback(item, index, array)}))
    .toSorted((a, b) => compareNullable(b.sort, a.sort))
    .map(({item}) => item);

export const rank = <T extends PropertyKey>(array: T[]) => Object.fromEntries(array.map(
    (item, index) => [item, index + 1]
).toReversed()) as Record<T, number>

export const rankBy = <T, U extends Comparable & PropertyKey>(
    array: T[], callback: (item: T, index: number, array: T[]) => U
) => rank(sortBy(array, callback).map(callback)) as Record<U, number>

declare global {
    interface ObjectConstructor {
        fromEntries<K extends PropertyKey, V>(
            entries: [K, V][] | readonly [K, V][]
        ): {
            [Key in K]: V
        };
    }
}