import {supabase} from "$lib/supabase";
import type {Class, Rating, Student} from "$lib/schema";

export const getStudentByEmail = async (email: string): Promise<Student> => (
    await supabase.from("student")
        .select("*")
        .eq("email", email)
        .single()
).data!;

export const getEmailByPassword = async (password: string): Promise<string | null> => (
    await supabase.rpc("get_email_by_password", { p: password })
).data;

export const getMyClass = async (klass: number): Promise<Class> => (
    await supabase.from("class")
        .select("*")
        .eq("id", klass)
        .single()
).data!;

export const getStudentsToRate = async (klass: number): Promise<Student[]> => (
    await supabase.from("student")
        .select("*")
        .eq("class", klass)
).data!;

export const getAlreadyRated = async (studentId: number): Promise<boolean> => (
    await supabase.from("rating")
        .select("", {count: 'exact'})
        .eq("by", studentId)
).count! > 0;

export const rate = async (ratings: Rating[]) =>
    await supabase.from("rating")
        .insert(ratings)