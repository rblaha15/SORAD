<script lang="ts">
    import {browser} from "$app/environment";
    import {page} from "$app/state";
    import ClassDetails from "$lib/components/admin/class/ClassDetails.svelte";
    import AdminOverview from "$lib/components/admin/AdminOverview.svelte";
    import StudentDetails from "$lib/components/admin/class/student/StudentDetails.svelte";
    import {isAdmin} from "$lib/data";
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";
    import PrintCodes from "$lib/components/admin/class/PrintCodes.svelte";

    const classId = $derived(browser ? page.url.searchParams.get('class') : undefined)
    const print = $derived(browser ? page.url.searchParams.get('print') : undefined)
    const studentId = $derived(browser ? page.url.searchParams.get('student') : undefined)

    onMount(async () => {
        const email = await database.auth.getEmail()
        if (!email || !isAdmin(email))
            window.location.replace(window.location.origin)
    })
</script>

{#if studentId === undefined || classId === undefined}
    <span class="loader"></span>
{:else if studentId !== null && classId !== null}
    <StudentDetails classId={Number(classId)} studentId={Number(studentId)} />
{:else if classId !== null}
    <ClassDetails classId={Number(classId)} />
{:else}
    <AdminOverview />
{/if}