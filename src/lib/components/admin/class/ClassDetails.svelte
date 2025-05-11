<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type { Class, Student } from "$lib/database";
    import database from "$lib/database/supabase.js";
    import { onMount } from "svelte";
    import { getStudentsScores, type RatingWithStudents } from "$lib/admin";
    import Collapsible from "$lib/components/Collapsible.svelte";
    import ClassChart from "./ClassChart.svelte";
    import StudentsTable from "$lib/components/admin/class/StudentsTable.svelte";
    import ClassSettings from "$lib/components/admin/class/ClassSettings.svelte";
    import { goto } from "$app/navigation";
    import TopScrollable from "$lib/components/TopScrollable.svelte";

    const { classId }: { classId: number } = $props()

    let klass = $state() as Class;
    let ratings = $state<RatingWithStudents[]>([]);
    let students = $state<Student[]>([]);
    let error = $state(false);

    const refresh = async () => {
        try {
            const _klass = await database.getMyClass(classId)
            const _ratings = await database.admin.getClassRatings(classId)
            const _students = await database.getStudentsOfClass(classId)

            klass = _klass
            students = _students
            ratings = _ratings.map(r => ({
                ...r, by: students.find(s => s.id == r.by)!, about: students.find(s => s.id == r.about)!
            }))
        } catch (e) {
            console.error(e)
            error = true
        }
    }
    onMount(refresh)
</script>

{#snippet title()}
    Administrace: třída {klass?.name ?? ''}
{/snippet}
{#snippet content()}
    <Collapsible label="Nastavení" open={klass ? students.length === 0 || ratings.length === 0 : false}>
        <ClassSettings {refresh} {classId} {klass} {students} {ratings} />
    </Collapsible>
    {#if students.length && ratings.length}
        <Collapsible label="Graf sympatií a vlivu">
            <TopScrollable>
                <ClassChart scores={getStudentsScores(students, ratings)} klass={klass.name} />
            </TopScrollable>
        </Collapsible>
        <Collapsible label="Seznam žáků">
            <StudentsTable {students} {ratings} allStudents={students} overview />
        </Collapsible>
    {/if}
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={() => goto(`/admin`)}>Zpět</button>
    <button class="secondary" onclick={database.auth.logOut}>Odhlásit se</button>
{/snippet}

<title>Třída {klass?.name ?? ''}</title>

{#if error}
    <BasicLayout {buttons} {title}>
        {#snippet content()}
            <p>Došlo k chybě při načítání třídy, nejspíše byla odstraněna.</p>
        {/snippet}
    </BasicLayout>
{:else if klass === undefined}
    <div><span class="loader"></span></div>
{:else}
    <BasicLayout {buttons} {content} {title} />
{/if}