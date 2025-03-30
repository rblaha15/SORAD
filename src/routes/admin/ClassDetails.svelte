<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class} from "$lib/database";
    import {chartConfig} from "./chartConfig.js";
    import {Chart} from "chart.js/auto";
    import database from "$lib/database/supabase.js";
    import {onMount} from "svelte";
    import {averageBy, type RatingWithStudents, type StudentScore} from "$lib/data";
    import {goto} from "$app/navigation";

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
        chart = new Chart(canvas, chartConfig(scores, (e) => {
            const points = chart!.getElementsAtEventForMode(e as unknown as Event, 'nearest', { intersect: true }, true)
            if (points.length) {
                const clickedPointIndex = points[0].datasetIndex;
                const student = scores[clickedPointIndex];
                goto(`/admin?class=${classId}&student=${student.id}`)
            }
        }));
    }
    onMount(refresh)
</script>

{#snippet title()}
    Třída: {klass.name}
{/snippet}
{#snippet content()}
    <div class="chart-holder">
        <p style:grid-area="T">Nejvíce oblíbení</p>
        <p style:grid-area="L">Nejméně vlivní</p>
        <canvas style:grid-area="C" bind:this={canvas}></canvas>
        <p style:grid-area="R">Nejvíce vlivní</p>
        <p style:grid-area="B">Nejméně oblíbení</p>
    </div>
{/snippet}
{#snippet buttons()}{/snippet}

{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title}/>
{/if}

<style>
    .chart-holder {
        display: grid;
        position: relative;
        width: 600px;
        height: 600px;
        grid-template-areas:
            ". T ."
            "L C R"
            ". B .";

        * {
            align-self: center;
            justify-self: center;
            text-align: center;
        }
    }
</style>