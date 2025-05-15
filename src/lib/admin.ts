import { type Rating, type Student } from "$lib/database";
import { averageBy } from "$lib/utils/sums";

export const isAdmin = (email: string) => email.endsWith('@gymceska.cz') || email == 'rblaha15@student.gymceska.cz'
export const isStudent = (email: string) => email.endsWith('@student.gymceska.cz')

export type Indexes = {
    /** Index vlivu */
    influence: number | undefined,
    /** Index obliby */
    popularity: number | undefined,
    /** Index náklonnosti */
    affection: number | undefined,
};

export type StudentScore = Student & Indexes;

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
): StudentScore => ({
    ...student,
    influence: averageBy(ratingsAbout, r => r.influence),
    popularity: averageBy(ratingsAbout, r => r.sympathy),
    affection: averageBy(ratingsBy, r => r.sympathy),
})

export type RatingWithStudents = Omit<Rating, 'by' | 'about'> & { by: Student, about: Student };