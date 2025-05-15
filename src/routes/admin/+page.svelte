<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/state";
    import ClassDetails from "$lib/components/admin/class/ClassDetails.svelte";
    import ClassList from "$lib/components/admin/AdminOverview.svelte";
    import StudentDetails from "$lib/components/admin/class/student/StudentDetails.svelte";
    import { isAdmin } from "$lib/admin";
    import { onMount } from "svelte";
    import database from "$lib/database/supabase";
    import StudentsImport from "$lib/components/admin/class/StudentsImport.svelte";
    import { goto } from "$app/navigation";

    const classId = $derived(browser ? page.url.searchParams.get('class') : undefined)
    const importStudents = $derived(browser ? page.url.searchParams.get('import') : undefined)
    const studentId = $derived(browser ? page.url.searchParams.get('student') : undefined)

    onMount(async () => {
        const email = await database.auth.getUserEmail()
        if (!email || !isAdmin(email)) await goto(`/`)
    })
</script>

{#if classId === undefined || importStudents === undefined || studentId === undefined}
    <div><span class="loader"></span></div>
{:else if classId !== null && studentId !== null}
    <StudentDetails classId={Number(classId)} studentId={Number(studentId)} />
{:else if classId !== null && importStudents !== null}
    <StudentsImport classId={Number(classId)} />
{:else if classId !== null}
    <ClassDetails classId={Number(classId)} />
{:else}
    <ClassList />
{/if}