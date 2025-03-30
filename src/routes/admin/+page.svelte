<script lang="ts">
    import {browser} from "$app/environment";
    import {page} from "$app/state";
    import ClassDetails from "$lib/components/admin/class/ClassDetails.svelte";
    import AdminOverview from "$lib/components/admin/AdminOverview.svelte";
    import StudentDetails from "$lib/components/admin/class/student/StudentDetails.svelte";

    const classId = $derived(browser ? page.url.searchParams.get('class') : null)
    const studentId = $derived(browser ? page.url.searchParams.get('student') : null)
</script>

{#if studentId !== null && classId !== null}
    <StudentDetails classId={Number(classId)} studentId={Number(studentId)} />
{:else if classId !== null}
    <ClassDetails classId={Number(classId)} />
{:else}
    <AdminOverview />
{/if}