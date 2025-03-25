export interface Database {
    getStudentByEmail: (email: string) => Promise<Student>
    getEmailByPassword: (password: string) => Promise<string>

    getMyClass: (classId: number) => Promise<Class>
    getStudentsOfClass: (classId: number) => Promise<Student[]>
    getAlreadyRated: (studentId: number) => Promise<boolean>
    rate: (ratings: Rating[]) => Promise<void>

    auth: {
        getEmail: () => Promise<string | null>
        logInWithMS: () => Promise<void>
        logInWithStudentPassword: (password: string) => Promise<boolean>
        logOut: () => Promise<void>
    }

    admin: {
        getClasses: () => Promise<Class[]>
        addClass: (klass: Class) => Promise<void>
        deleteClass: (classId: number) => Promise<void>
        updateClass: (klass: Class) => Promise<void>

        addStudents: (students: Student[]) => Promise<void>
        updateStudents: (students: Student[]) => Promise<void>
        removeStudents: (studentIds: number[]) => Promise<void>

        addStudentPasswords: (studentPasswords: StudentPassword[]) => Promise<void>
        getStudentPasswords: (studentEmails: string[]) => Promise<StudentPassword[]>

        createStudentAccounts: (students: { email: string, password: string }[]) => Promise<void>
    }
}


export type Class = {
    id: number
    name: string
    grade: number
    enabled: boolean
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