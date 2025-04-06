<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class} from "$lib/database";
    import database from "$lib/database/supabase.js";
    import {onMount} from "svelte";
    import {getStudentScore, type RatingWithStudents, type StudentScore} from "$lib/data";
    import Collapsible from "$lib/components/Collapsible.svelte";
    import ClassChart from "./ClassChart.svelte";
    import StudentsTable from "$lib/components/admin/class/StudentsTable.svelte";

    const {classId}: { classId: number } = $props()

    let klass = $state() as Class;
    let ratings = $state<RatingWithStudents[]>([]);
    let scores = $state<StudentScore[]>([]);

    const refresh = async () => {
        klass = await database.getMyClass(classId)
        const r = await database.admin.getClassRatings(classId)
        const students = await database.getStudentsOfClass(classId)
        ratings = r.map(r => ({
            ...r, by: students.find(s => s.id == r.by)!, about: students.find(s => s.id == r.about)!
        }))
        scores = students.map(s =>
            getStudentScore(s, r.filter(r => r.about == s.id), r.filter(r => r.by == s.id))
        )
    }
    onMount(refresh)
</script>

{#snippet title()}
    Třída: {klass.name}
{/snippet}
{#snippet content()}
    <Collapsible>
        {#snippet label({collapsed})}
            {collapsed ? 'Zobrazit graf' : 'Skrýt graf'}
        {/snippet}
        <ClassChart {scores} />
    </Collapsible>
    <Collapsible>
        {#snippet label({collapsed})}
            {collapsed ? 'Zobrazit seznam žáků' : 'Skrýt seznam žáků'}
        {/snippet}
        <StudentsTable {scores} allScores={scores}/>
    </Collapsible>
{/snippet}
{#snippet buttons()}
    <button class="grey" onclick={() => window.history.back()}>Zpět</button>
    <button class="grey" onclick={database.auth.logOut} style="margin-right: 'auto';">Odhlásit</button>
{/snippet}

{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title}/>
{/if}