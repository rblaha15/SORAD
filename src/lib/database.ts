import {supabase} from "$lib/supabase";
import seedrandom from "seedrandom"
import type {Class, Rating, Student} from "$lib/schema";

const getMyself = async (studentId: number): Promise<Student> => (
    await supabase.from("student")
        .select("*")
        .eq("id", studentId)
        .single()
).data!;

const getMyClass = async (klass: number): Promise<Class> => (
    await supabase.from("class")
        .select("*")
        .eq("id", klass)
        .single()
).data!;

const getStudentsToRate = async (klass: number): Promise<Student[]> => (
    await supabase.from("student")
        .select("*")
        .eq("class", klass)
).data!;

export const rate = async (ratings: Rating[]) =>
    await supabase.from("rating")
        .insert(ratings)

export type Data = {
    myself: Student
    myClass: Class
    students: Student[]
}

export const allData = async (myId: number): Promise<Data> => {
    let myself = await getMyself(myId);
    return {
        myself: myself,
        myClass: await getMyClass(myself.class),
        students: await getStudentsToRate(myself.class),
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
    ((r.liking != 0 && r.liking != 4) || r.reasoning != '')