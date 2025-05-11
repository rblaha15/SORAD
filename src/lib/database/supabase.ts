import { createClient } from '@supabase/supabase-js';
import type { Class, Database, Rating, Student, StudentPassword } from '$lib/database';

type DatabaseSchema = {
    public: {
        Tables: {
            class: {
                Row: Class
                Insert: Omit<Class, 'id'> & { id?: number }
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
                Insert: Omit<Student, 'id'> & { id?: number }
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
            get_class_ratings: {
                Args: {
                    class_id: number
                }
                Returns: Rating[]
            }
        }
        Enums: Record<never, never>
        CompositeTypes: Record<never, never>
    }
}

const client = createClient<DatabaseSchema, 'public', DatabaseSchema['public']>(
    'https://jmbgjmilpreombqpztli.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYmdqbWlscHJlb21icXB6dGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjQ0NDIsImV4cCI6MjA1NjkwMDQ0Mn0.Vr69TqY4bcTFFCbC7TBA69eWEeNhgkRXre53h5qfO-Q'
)

const database: Database = {
    getStudentByEmail: async email => {
        const { data, error } = await client.from('student').select('*')
            .eq('email', email)
            .single()
        if (error) throw error
        else return data
    },
    getStudentById: async id => {
        const { data, error } = await client.from('student').select('*')
            .eq('id', id)
            .single()
        if (error) throw error
        else return data
    },
    getEmailByPassword: async password => {
        const { data, error } = await client.rpc('get_email_by_password', { p: password })
        if (error) throw error
        return data
    },
    getMyClass: async klass => {
        const { data, error } = await client.from('class').select('*')
            .eq('id', klass)
            .single()
        if (error) throw error
        return data
    },
    getStudentsOfClass: async klass => {
        const { data, error } = await client.from('student').select('*')
            .eq('class', klass)
        if (error) throw error
        return data
    },
    getAlreadyRated: async studentId => {
        const { count, error } = await client.from('rating').select("", { count: 'exact' })
            .eq('by', studentId)
        if (error) throw error
        return (count ?? 0) > 0
    },
    rate: async ratings => {
        const { error } = await client.from('rating')
            .upsert(ratings)
        if (error) throw error
    },

    auth: {
        getEmail: async () => (await client.auth.getUser())?.data?.user?.email ?? null,
        logInWithMS: async () => {
            const { error } = await client.auth.signInWithOAuth({
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
            const { error } = await client.auth.signInWithPassword({
                email, password,
            })
            if (error) {
                console.error(error)
                return false
            } else {
                location.reload();
                return true
            }
        },

        logOut: async () => {
            const { error } = await client.auth.signOut()
            if (error) console.error(error)
            else location.reload();
        }
    },

    admin: {
        getClasses: async () => {
            const { data, error } = await client.from('class').select('*')
            if (error) throw error
            return data
        },
        setClass: async klass => {
            const { error } = await client.from('class').upsert(klass)
            if (error) throw error
        },
        deleteClass: async classId => {
            const { error } = await client.from('class').delete()
                .eq('id', classId)
            if (error) throw error
        },

        getClassRatings: async classId => {
            const { data, error } = await client
                .rpc('get_class_ratings', { class_id: classId });
            if (error) throw error
            return data
        },
        removeRatings: async studentIds => {
            const { error } = await client.from('rating').delete()
                .or(`by.in.(${studentIds.join(',')}),about.in.(${studentIds.join(',')})`)
            if (error) throw error
        },

        setStudents: async students => {
            const { error } = await client.from('student').upsert(students)
            if (error) throw error
        },
        removeStudents: async studentIds => {
            const { error } = await client.from('student').delete()
                .in('id', studentIds)
            if (error) throw error
        },
        getStudentPasswords: async studentEmails => {
            const { data, error } = await client.from('student_password').select('*')
                .in('email', studentEmails)
            if (error) throw error
            return Object.fromEntries(data.map(s => [s.email, s.password] as [string, string]))
        },
        createStudentAccountsAndSavePasswords: async students => {
            const { error } = await client.functions.invoke<string>('create-users', {
                body: { users: Object.entries(students).map(([email, password]) => ({ email, password })) }
            })
            if (error) throw error
        },
        deleteStudentAccountsAndPasswords: async students => {
            const { error } = await client.functions.invoke<string>('delete-users', {
                body: { users: students }
            })
            if (error) throw error
        },
    }
}

export default database