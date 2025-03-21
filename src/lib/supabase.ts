import {createClient} from '@supabase/supabase-js'
import type {Database} from '$lib/schema';

export const supabase = createClient<Database>(
    'https://jmbgjmilpreombqpztli.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYmdqbWlscHJlb21icXB6dGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjQ0NDIsImV4cCI6MjA1NjkwMDQ0Mn0.Vr69TqY4bcTFFCbC7TBA69eWEeNhgkRXre53h5qfO-Q'
)