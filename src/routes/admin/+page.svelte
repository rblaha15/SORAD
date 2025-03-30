<script lang="ts">
    import {browser} from "$app/environment";
    import {page} from "$app/state";
    import ClassDetails from "./ClassDetails.svelte";
    import AdminOverview from "./AdminOverview.svelte";
    import StudentDetails from "./StudentDetails.svelte";

    const classId = browser ? page.url.searchParams.get('class') : null
    const studentId = browser ? page.url.searchParams.get('student') : null
</script>

{#if studentId !== null && classId !== null}
    <StudentDetails classId={Number(classId)} studentId={Number(studentId)} />
{:else if classId !== null}
    <ClassDetails classId={Number(classId)} />
{:else}
    <AdminOverview />
{/if}