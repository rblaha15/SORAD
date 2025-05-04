import { type Rating, type Student } from "$lib/database";
import { averageBy } from "$lib/utils/sums";
import { round } from "./utils/arithmetics";

export const isAdmin = (email: string) => email.endsWith('@gymceska.cz') || email == 'rblaha15@student.gymceska.cz'

type Indexes = {
    /** Index vlivu */
    influence: number | undefined,
    /** Index obliby */
    popularity: number | undefined,
    /** Index ovlivnitelnosti */
    influenceability: number | undefined,
    /** Index náklonnosti */
    affection: number | undefined,
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
        : round(averageBy(ratingsAbout, r => r.influence));
    const popularity = ratingsAbout.length == 0 ? undefined
        : round(averageBy(ratingsAbout, r => r.sympathy));
    const affection = ratingsBy.length == 0 ? undefined
        : round(averageBy(ratingsBy, r => r.sympathy));
    const influenceability = ratingsBy.length == 0 ? undefined
        : round(averageBy(ratingsBy, r => r.influence));
    return ({
        ...student, influence, popularity, affection, influenceability,
        overall: influence == undefined || popularity == undefined ? undefined
            : (influence + popularity) / 2
    });
}

export type RatingWithStudents = Omit<Rating, 'by' | 'about'> & { by: Student, about: Student };