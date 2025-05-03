export interface Database {
    getStudentByEmail: (email: string) => Promise<Student>
    getStudentById: (studentId: number) => Promise<Student>
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
        setClass: (klass: Omit<Class, 'id'> & { id?: number }) => Promise<void>
        deleteClass: (classId: number) => Promise<void>

        getClassRatings: (classId: number) => Promise<Rating[]>
        removeRatings: (studentIds: number[]) => Promise<void>

        setStudents: (students: Omit<Student, 'id'>[]) => Promise<void>
        removeStudents: (studentIds: number[]) => Promise<void>

        getStudentPasswords: (studentEmails: string[]) => Promise<StudentPasswords>
        createStudentAccountsAndSavePasswords: (students: StudentPasswords) => Promise<void>
        deleteStudentAccountsAndPasswords: (students: Student[]) => Promise<void>
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
    sympathy: number
    influence: number
    reasoning: string
}

export type StudentPasswords = Record<string, string>