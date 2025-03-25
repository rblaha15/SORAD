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
    liking: -1, popularity: -1, reasoning: ''
})

export const validateRating = (r: Rating) =>
    r.liking != -1 && r.popularity != -1 &&
    ((r.liking != 0 && r.liking != 4) || r.reasoning)