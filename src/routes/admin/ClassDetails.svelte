<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class} from "$lib/database";
    import {chartConfig} from "./chartConfig.js";
    import {Chart} from "chart.js/auto";
    import database from "$lib/database/supabase.js";
    import {onMount} from "svelte";
    import {averageBy, type RatingWithStudents, type StudentScore} from "$lib/data";
    import {goto} from "$app/navigation";
    import Collapsible from "$lib/components/Collapsible.svelte";

    let {classId}: { classId: number } = $props()

    let canvas = $state() as HTMLCanvasElement;
    let klass = $state() as Class;
    let ratings = $state<RatingWithStudents[]>([]);
    let scores = $state<StudentScore[]>([]);
    let chart = $state<Chart>();

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
        chart?.destroy()
        chart = new Chart(canvas, chartConfig(scores, s => {
            goto(`/admin?class=${classId}&student=${s.id}`)
        }));
    }
    onMount(refresh)
    onMount(async () => {
        const zoom = await import("chartjs-plugin-zoom");
        Chart.register(zoom.default);
    })
</script>

{#snippet title()}
    Třída: {klass.name}
{/snippet}
{#snippet content()}
    <Collapsible>
        {#snippet label({collapsed})}
            {collapsed ? 'Zobrazit graf' : 'Skrýt graf'}
        {/snippet}
        <div class="chart">
            <p style:grid-area="T">Nejvíce<br />oblíbení</p>
            <p style:grid-area="L">Nejméně<br />vlivní</p>
            <div class="chart-container" style:grid-area="C"><canvas bind:this={canvas}></canvas></div>
            <p style:grid-area="R">Nejvíce<br />vlivní</p>
            <p style:grid-area="B">Nejméně<br />oblíbení</p>
        </div>
    </Collapsible>
{/snippet}
{#snippet buttons()}{/snippet}

{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title}/>
{/if}

<style>
    .chart {
        display: grid;
        grid-template-areas:
            ". T ."
            "L C R"
            ". B .";

        .chart-container {
            position: relative;
            width: 100%;
            /*max-width: 600px;*/
            /*max-height: 600px;*/
        }

        * {
            align-self: center;
            justify-self: center;
            text-align: center;
        }
    }
</style>