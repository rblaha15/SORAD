<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class} from "$lib/database";
    import database from "$lib/database/supabase.js";
    import {onMount} from "svelte";
    import {averageBy, type RatingWithStudents, type StudentScore} from "$lib/data";
    import Collapsible from "$lib/components/Collapsible.svelte";
    import Chart from "./Chart.svelte";
    import StudentsOverview from "$lib/components/admin/class/StudentsOverview.svelte";

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
        scores = students.map(s => {
            const studentRatings = r.filter(r => r.about == s.id);
            return ({
                ...s,
                liking: Number(averageBy(studentRatings, r => r.liking).toFixed(2)),
                popularity: Number(averageBy(studentRatings, r => r.popularity).toFixed(2)),
            });
        })
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
        <Chart {scores} {classId} />
    </Collapsible>
    <Collapsible>
        {#snippet label({collapsed})}
            {collapsed ? 'Zobrazit seznam žáků' : 'Skrýt seznam žáků'}
        {/snippet}
        <StudentsOverview {scores} {classId} />
    </Collapsible>
{/snippet}
{#snippet buttons()}{/snippet}

{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title}/>
{/if}