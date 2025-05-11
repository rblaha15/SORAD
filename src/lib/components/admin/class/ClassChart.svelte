<script lang="ts">
    import type { StudentScore } from "$lib/admin";
    import { Chart } from "chart.js/auto";
    import { classChart } from "./classChart";
    import { printComponent } from "$lib/print";
    import ClassChart from "$lib/components/admin/class/ClassChart.svelte";
    import { onMount } from "svelte";

    let { scores, print = false, klass }: { scores: StudentScore[], print?: boolean, klass: string } = $props()

    let canvas: HTMLCanvasElement;
    let chart = $state<Chart>();

    onMount(() => {
        chart = new Chart(canvas, classChart(scores, print));
        return () => chart?.destroy()
    })

    const printTitle = `${klass} — kombinace hodnocení sympatií a vlivu`
</script>

{#if print}
    <title>{printTitle}</title>
    <h3>{printTitle}</h3>
{/if}

<div class={['chart-root', {print}]}>
    {#if !print}
        <button
            class="neutral"
            onclick={() => printComponent(ClassChart, { scores, klass, print: true })}
        >Vytiskonout
        </button>
    {/if}
    <div class="chart">
        <div class="chart-container" style:grid-area="C">
            <canvas bind:this={canvas}></canvas>
        </div>
        <p style:grid-area="R">Nejvíce<br /> vlivní <br />(1)</p>
        <p style:grid-area="L">Nejméně<br /> vlivní <br />(5)</p>
        <p style:grid-area="T">Nejvíce oblíbení (1)</p>
        <p style:grid-area="B">Nejméně oblíbení (5)</p>
    </div>
</div>

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

    .chart-root {
        &:not(.print) .chart {
            width: 100%;
            grid-template-columns: min-content minmax(300px, 500px) min-content;
        }

        &.print {
            width: 210mm;

            .chart {
                grid-template-columns: min-content 1fr min-content;
            }
        }
    }
</style>