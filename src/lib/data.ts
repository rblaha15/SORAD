import seedrandom from "seedrandom";
import {type Class, type Rating, type Student} from "$lib/database";
import database from "$lib/database/supabase";

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


export type StudentScore = Student & {
    /** Index vlivu */
    influence: number,
    /** Index obliby */
    popularity: number,
    /** Index náklonnosti */
    affection: number,
    /** Index ovlivnitelnosti */
    influenceability: number,
    /** Celkové hodnocení */
    overall: number,
};

export const getStudentScore = (
    student: Student,
    ratingsAbout: Omit<Rating, "by" | "about">[],
    ratingsBy: Omit<Rating, "by" | "about">[]
): StudentScore => {
    const influence = Number(averageBy(ratingsAbout, r => r.influence).toFixed(2));
    const popularity = Number(averageBy(ratingsAbout, r => r.sympathy).toFixed(2));
    const affection = Number(averageBy(ratingsBy, r => r.sympathy).toFixed(2));
    const influenceability = Number(averageBy(ratingsBy, r => r.influence).toFixed(2));
    return ({
        ...student, influence, popularity, affection, influenceability,
        overall: (influence + popularity) / 2
    });
}

export type RatingWithStudents = Omit<Rating, 'by' | 'about'> & { by: Student, about: Student };

export const averageBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => number) =>
    sumBy(array, callback) / array.length;

export const sumBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => number) =>
    array.reduce((sum, item, index, array) => sum + callback(item, index, array), 0);

export type Comparable = number | string

export const sortBy = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) => array
    .map((item, index, array) => ({item, sort: callback(item, index, array)}))
    .toSorted((a, b) => typeof a.sort == 'string'
        ? a.sort.localeCompare(b.sort as string)
        : a.sort - (b.sort as number))
    .map(({item}) => item);

export const sortByDescending = <T>(array: T[], callback: (item: T, index: number, array: T[]) => Comparable) => array
    .map((item, index, array) => ({item, sort: callback(item, index, array)}))
    .toSorted((a, b) => typeof b.sort == 'string'
        ? b.sort.localeCompare(a.sort as string)
        : (b.sort as number) - (a.sort as number))
    .map(({item}) => item);
