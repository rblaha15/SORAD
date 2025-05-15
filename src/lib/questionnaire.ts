import type { Class, Rating, Student } from "$lib/database";
import seedrandom from "seedrandom";
import { shuffled } from "$lib/utils/random";
import { sortedBy } from "$lib/utils/comparisons";
import { chunked } from "$lib/utils/splitting";

export type Phase = 'influence' | 'sympathy' | 'sympathy-reasoning'
export type State = {
    phase: 'influence',
    progress: 'introduction'
    group: undefined
} | {
    phase: Phase,
    progress: 'tutorial'
    group: undefined
} | {
    phase: Phase,
    progress: 'ratings'
    group: number
}

export type QuestionnaireData = {
    myself: Student
    myClass: Class
    students: Student[]
    alreadyRated: boolean
}
export type Ratings = { [about: number]: Rating }

const maxGroupSize = (phase: string) => phase == 'sympathy-reasoning' ? Number.POSITIVE_INFINITY : 7
export const groupCount = (studentCount: number, phase: Phase) => Math.ceil(studentCount / maxGroupSize(phase))

const defaultRating = (by: number, about: number): Rating => ({
    by, about,
    influence: -1, sympathy: -1, reasoning: ''
})
export const defaultRatings = (myself: Student, others: Student[]): Ratings =>
    Object.fromEntries(others.map(student => [student.id, defaultRating(myself.id, student.id)]))

export const getRatingGroups = (myself: Student, students: Student[], phase: Phase): Student[][] => {
    const classmates = students.toSpliced(students.findIndex(s => s.id == myself.id), 1);

    const random = seedrandom(`${myself.id}`)
    const shuffledStudents = shuffled(classmates, random)
    const orderedStudents = sortedBy(shuffledStudents, s => s.is_girl != myself.is_girl)

    const studentCount = students.length;
    const chunkCount = groupCount(studentCount, phase);
    const chunkSize = Math.ceil(studentCount / chunkCount);
    return chunked(orderedStudents, chunkSize)
}

export const validateRating = (r: Rating, phase: Phase) =>
    r.influence != -1 && (r.sympathy != -1 || phase == 'influence')