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

    const { classId }: { classId: number } = $props()

    let klass = $state() as Class;
    let ratings = $state<RatingWithStudents[]>([]);
    let students = $state<Student[]>([]);

    const refresh = async () => {
        const _klass = await database.getMyClass(classId)
        const _ratings = await database.admin.getClassRatings(classId)
        const _students = await database.getStudentsOfClass(classId)

        klass = _klass
        students = _students
        ratings = _ratings.map(r => ({
            ...r, by: students.find(s => s.id == r.by)!, about: students.find(s => s.id == r.about)!
        }))
    }
    onMount(refresh)
</script>

{#snippet title()}
    Administrace: třída {klass.name}
{/snippet}
{#snippet content()}
    <Collapsible label="Nastavení" open={klass ? students.length === 0 : false}>
        <ClassSettings {refresh} {classId} {klass} {students} {ratings} />
    </Collapsible>
    {#if students.length && ratings.length}
        <Collapsible label="Graf sympatií a vlivu">
            <ClassChart scores={getStudentsScores(students, ratings)} />
        </Collapsible>
        <Collapsible label="Seznam žáků">
            <StudentsTable {students} {ratings} allStudents={students} overview />
        </Collapsible>
        <Collapsible label="Třídní indexy">
            <ul>
                <li><strong>Index vlivu</strong> – Aritmetický průměr všech hodnocení vlivu, které daný žák obdržel</li>
                <li><strong>Index obliby</strong> – Aritmetický průměr všech hodnocení sympatie, které daný žák obdržel</li>
                <li><strong>Index náklonnosti</strong> – Aritmetický průměr všech hodnocení sympatie, které daný žák udělil</li>
            </ul>
        </Collapsible>
    {/if}
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={() => goto(`/admin`, { replaceState: true })}>Zpět</button>
    <button class="secondary" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit</button>
{/snippet}

{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title} />
{/if}