<script lang="ts">
    import type { RatingWithStudents } from "$lib/data";
    import { Chart } from "chart.js/auto";
    import { studentChart } from "./studentChart";
    import type { Student } from "$lib/database";

    let {ratings, myself}: { ratings: RatingWithStudents[], myself: Student } = $props()
    const bySameStudent = new Set(ratings.map(r => r.by.id)).size == 1

    let canvas = $state() as HTMLCanvasElement;
    let chart = $state<Chart>();

    $effect(() => {
        if (!canvas) return;

        const classmates = ratings.toSpliced(ratings.findIndex(r => r.about.id == r.by.id), 1);
        const myself2 = { about: myself, by: myself, sympathy: 0 };
        chart = new Chart(canvas, studentChart(
            [...myself2 ? [myself2] : [], ...classmates].map(r => ({
                value: r.sympathy,
                student: bySameStudent ? r.about : r.by
            })),
        ));

        return () => {
            chart?.destroy()
        }
    })
</script>

<div class="chart-container" style:grid-area="C">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .chart-container {
        position: relative;
        aspect-ratio: 1 / 1;
        width: 100%;
        min-width: 300px;
        max-width: 500px;
        min-height: 300px;
        max-height: 500px;
        margin: .375rem;
    }
</style>