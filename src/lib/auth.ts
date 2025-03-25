import {supabase} from "$lib/supabase";
import {browser} from "$app/environment";
import {getEmailByPassword} from "$lib/database";

export const getEmail = async () => (await supabase.auth.getUser())?.data?.user?.email

export const logInWithMS = async (url: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
            redirectTo: url + '/login?azure-success',
            scopes: 'email',
        }
    })
    if (error) console.error(error)
}

export const logInWithStudentPassword = async (password: string) => {
    const email = await getEmailByPassword(password)
    if (!email) return false
    const { error } = await supabase.auth.signInWithPassword({
        email, password,
    })
    if (error) return false
    if (browser) window.location.reload();
    return true
}

export const logOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error)
    else if (browser) window.location.reload();
}