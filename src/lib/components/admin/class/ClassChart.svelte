<script lang="ts">
    import type {StudentScore} from "$lib/admin";
    import {Chart} from "chart.js/auto";
    import {classChart} from "./classChart";
    import TopScrollable from "$lib/components/TopScrollable.svelte";

    let {scores}: { scores: StudentScore[] } = $props()

    let canvas = $state() as HTMLCanvasElement;
    let chart = $state<Chart>();

    $effect(() => {
        if (!canvas) return;

        chart = new Chart(canvas, classChart(scores));

        return () => {
            chart?.destroy()
        }
    })
</script>

<TopScrollable>
    <div class="chart">
        <div class="chart-container" style:grid-area="C">
            <canvas bind:this={canvas}></canvas>
        </div>
        <p style:grid-area="R">Nejvíce<br/> vlivní <br/>(1)</p>
        <p style:grid-area="L">Nejméně<br/> vlivní <br/>(5)</p>
        <p style:grid-area="T">Nejvíce oblíbení (1)</p>
        <p style:grid-area="B">Nejméně oblíbení (5)</p>
    </div>
</TopScrollable>

<style>
    .chart {
        display: grid;
        grid-template-areas:
            ". T ."
            "L C R"
            ". B .";
        grid-template-columns: min-content minmax(300px, 500px) min-content;

        .chart-container {
            position: relative;
            aspect-ratio: 1 / 1;
            width: 100%;
        }

        * {
            align-self: center;
            justify-self: center;
            text-align: center;
        }
    }
</style>