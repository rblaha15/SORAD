import {createClient} from '@supabase/supabase-js';
import type {Class, Database, Rating, Student, StudentPassword} from '$lib/database';

type DatabaseSchema = {
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
                        foreignKeyName: 'rating_about_fkey'
                        columns: ['about']
                        isOneToOne: false
                        referencedRelation: 'student'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'rating_by_fkey'
                        columns: ['by']
                        isOneToOne: false
                        referencedRelation: 'student'
                        referencedColumns: ['id']
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
                        foreignKeyName: 'student_class_fkey'
                        columns: ['class']
                        isOneToOne: false
                        referencedRelation: 'class'
                        referencedColumns: ['id']
                    },
                ]
            }
            student_password: {
                Row: StudentPassword
                Insert: StudentPassword
                Update: Partial<StudentPassword>
                Relationships: [
                    {
                        foreignKeyName: 'student_password_email_fkey'
                        columns: ['email']
                        isOneToOne: true
                        referencedRelation: 'student'
                        referencedColumns: ['email']
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

const client = createClient<DatabaseSchema>(
    'https://jmbgjmilpreombqpztli.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYmdqbWlscHJlb21icXB6dGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjQ0NDIsImV4cCI6MjA1NjkwMDQ0Mn0.Vr69TqY4bcTFFCbC7TBA69eWEeNhgkRXre53h5qfO-Q'
)

const createRandomPassword = () =>
    [...Array(6)].map(() => Math.random().toString(36)[2] || '0').join('').toUpperCase()

const database: Database = {
    getStudentByEmail: async email => {
        const {data, error} = await client.from('student').select('*')
            .eq('email', email)
            .single()
        if (error) throw error
        else return data
    },
    getEmailByPassword: async password => {
        const {data, error} = await client.rpc('get_email_by_password', {p: password})
        if (error) throw error
        return data
    },
    getMyClass: async klass => {
        const {data, error} = await client.from('class').select('*')
            .eq('id', klass)
            .single()
        if (error) throw error
        return data
    },
    getStudentsOfClass: async klass => {
        const {data, error} = await client.from('student').select('*')
            .eq('class', klass)
        if (error) throw error
        return data
    },
    getAlreadyRated: async studentId => {
        const {count, error} = await client.from('rating').select("", {count: 'exact'})
            .eq('by', studentId)
        if (error) throw error
        return (count ?? 0) > 0
    },
    rate: async ratings => {
        const {error} = await client.from('rating')
            .insert(ratings)
        if (error) throw error
    },

    auth: {
        getEmail: async () => (await client.auth.getUser())?.data?.user?.email ?? null,
        logInWithMS: async () => {
            const {error} = await client.auth.signInWithOAuth({
                provider: 'azure',
                options: {
                    redirectTo: window.location.href,
                    scopes: 'email',
                }
            })
            if (error) console.error(error)
        },

        logInWithStudentPassword: async (password) => {
            const email = await database.getEmailByPassword(password)
            if (!email) return false
            const {error} = await client.auth.signInWithPassword({
                email, password,
            })
            if (error) {
                console.error(error)
                return false
            } else {
                window.location.reload();
                return true
            }
        },

        logOut: async () => {
            const {error} = await client.auth.signOut()
            if (error) console.error(error)
            else window.location.reload();
        }
    },

    admin: {
        getClasses: async () => {
            const {data, error} = await client.from('class').select('*')
            if (error) throw error
            return data
        },
        addClass: async klass => {
            const {error} = await client.from('class').insert(klass)
            if (error) throw error
        },
        deleteClass: async classId => {
            const {error} = await client.from('class').delete()
                .eq('id', classId)
            if (error) throw error
        },
        updateClass: async klass => {
            const {error} = await client.from('class').update(klass)
            if (error) throw error
        },

        addStudents: async students => {
            let {error} = await client.from('student').insert(students)
            if (error) throw error
        },
        updateStudents: async students => {
            const {error} = await client.from('student').upsert(students)
            if (error) throw error
        },
        removeStudents: async studentIds => {
            const {error} = await client.from('student').delete()
                .containedBy('id', studentIds)
            if (error) throw error
        },

        addStudentPasswords: async studentPasswords => {
            let {error} = await client.from('student_password').insert(studentPasswords)
            if (error) throw error
        },
        getStudentPasswords: async studentEmails => {
            const {data, error} = await client.from('student_password').select('*')
                .containedBy('email', studentEmails)
            if (error) throw error
            return data
        },

        createStudentAccounts: async students => {
            for (const student of students) {
                await client.auth.signUp(student)
            }
        },
    }
}

export default database