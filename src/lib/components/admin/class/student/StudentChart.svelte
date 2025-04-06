<script lang="ts">
    import type {RatingWithStudents} from "$lib/data";
    import {Chart} from "chart.js/auto";
    import {studentChart} from "./studentChart";

    let {ratings}: { ratings: RatingWithStudents[] } = $props()
    const bySameStudent = new Set(ratings.map(r => r.by.id)).size == 1

    let canvas = $state() as HTMLCanvasElement;
    let chart = $state<Chart>();

    $effect(() => {
        if (!canvas) return;

        const myIndex = ratings.findIndex(r => r.by.id == r.about.id);
        const classmates = ratings.toSpliced(myIndex, 1);

        chart = new Chart(canvas, studentChart(
            [{...ratings[myIndex], sympathy: 0}, ...classmates].map(r => ({
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