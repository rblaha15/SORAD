<script lang="ts">
    import type {StudentScore} from "$lib/data";
    import {onMount} from "svelte";
    import {Chart} from "chart.js/auto";
    import {chartConfig} from "./chartConfig";
    import {goto} from "$app/navigation";

    let {scores, classId}: { scores: StudentScore[], classId: number } = $props()

    let canvas = $state() as HTMLCanvasElement;
    let chart = $state<Chart>();

    onMount(async () => {
        const zoom = await import("chartjs-plugin-zoom");
        Chart.register(zoom.default);
    })

    $effect(() => {
        if (!canvas) return;

        chart = new Chart(canvas, chartConfig(scores, s => {
            goto(`/admin?class=${classId}&student=${s.id}`)
        }));

        return () => {
            chart?.destroy()
        }
    })
</script>

<div class="chart">
    <p style:grid-area="T">Nejvíce<br/>oblíbení</p>
    <p style:grid-area="L">Nejméně<br/>vlivní</p>
    <div class="chart-container" style:grid-area="C">
        <canvas bind:this={canvas}></canvas>
    </div>
    <p style:grid-area="R">Nejvíce<br/>vlivní</p>
    <p style:grid-area="B">Nejméně<br/>oblíbení</p>
</div>

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
            aspect-ratio: 1 / 1;
            max-width: 500px;
            max-height: 500px;
        }

        * {
            align-self: center;
            justify-self: center;
            text-align: center;
        }
    }
</style>