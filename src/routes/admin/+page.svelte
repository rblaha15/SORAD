<script lang="ts">
    import {browser} from "$app/environment";
    import {page} from "$app/state";
    import ClassDetails from "$lib/components/admin/class/ClassDetails.svelte";
    import AdminOverview from "$lib/components/admin/AdminOverview.svelte";
    import StudentDetails from "$lib/components/admin/class/student/StudentDetails.svelte";
    import {isAdmin} from "$lib/admin";
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";
    import StudentsImport from "$lib/components/admin/class/StudentsImport.svelte";

    const classId = $derived(browser ? page.url.searchParams.get('class') : undefined)
    const importStudents = $derived(browser ? page.url.searchParams.get('import') : undefined)
    const studentId = $derived(browser ? page.url.searchParams.get('student') : undefined)

    onMount(async () => {
        const email = await database.auth.getEmail()
        if (!email || !isAdmin(email))
            window.location.replace(window.location.origin)
    })
</script>

{#if classId === undefined || importStudents === undefined || studentId === undefined}
    <span class="loader"></span>
{:else if classId !== null && studentId !== null}
    <StudentDetails classId={Number(classId)} studentId={Number(studentId)} />
{:else if classId !== null && importStudents !== null}
    <StudentsImport classId={Number(classId)} />
{:else if classId !== null}
    <ClassDetails classId={Number(classId)} />
{:else}
    <AdminOverview />
{/if}