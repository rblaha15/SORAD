export type Database = {
    public: {
        Tables: {
            class: {
                Row: Class
                Insert: Class
                Update: Partial<Class>
                Relationships: []
            }
            rating: {
                Row: Rating
                Insert: Rating
                Update: Partial<Rating>
                Relationships: [
                    {
                        foreignKeyName: "rating_about_fkey"
                        columns: ["about"]
                        isOneToOne: false
                        referencedRelation: "student"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "rating_by_fkey"
                        columns: ["by"]
                        isOneToOne: false
                        referencedRelation: "student"
                        referencedColumns: ["id"]
                    },
                ]
            }
            student: {
                Row: Student
                Insert: Student & {
                    id?: number
                }
                Update: Partial<Student>
                Relationships: [
                    {
                        foreignKeyName: "student_class_fkey"
                        columns: ["class"]
                        isOneToOne: false
                        referencedRelation: "class"
                        referencedColumns: ["id"]
                    },
                ]
            }
            student_password: {
                Row: StudentPassword
                Insert: StudentPassword
                Update: Partial<StudentPassword>
                Relationships: [
                    {
                        foreignKeyName: "student_password_email_fkey"
                        columns: ["email"]
                        isOneToOne: true
                        referencedRelation: "student"
                        referencedColumns: ["email"]
                    },
                ]
            }
        }
        Views: Record<never, never>
        Functions: {
            get_email_by_password: {
                Args: {
                    p: string
                }
                Returns: string
            }
        }
        Enums: Record<never, never>
        CompositeTypes: Record<never, never>
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