export interface Database {
    getStudentByEmail: (email: string) => Promise<Student>
    getEmailByPassword: (password: string) => Promise<string>

    getMyClass: (classId: number) => Promise<Class>
    getStudentsToRate: (classId: number) => Promise<Student[]>
    getAlreadyRated: (studentId: number) => Promise<boolean>
    rate: (ratings: Rating[]) => Promise<void>

    auth: {
        getEmail: () => Promise<string | null>
        logInWithMS: () => Promise<void>
        logInWithStudentPassword: (password: string) => Promise<boolean>
        logOut: () => Promise<void>
    }
}


export type Class = {
    id: number
    name: string
    grade: number
}
export type Student = {
    class: number
    id: number
    is_girl: boolean
    names: string
    student_number: number
    surname: string
    email: string
}
export type StudentPassword = {
    email: string
    password: string
}
export type Rating = {
    about: number
    by: number
    liking: -1 | 0 | 1 | 2 | 3 | 4
    popularity: -1 | 0 | 1 | 2 | 3 | 4
    reasoning: string
}