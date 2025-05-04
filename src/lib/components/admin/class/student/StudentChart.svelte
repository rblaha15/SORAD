<script lang="ts">
    import type { RatingWithStudents } from "$lib/data";
    import { Chart } from "chart.js/auto";
    import { studentChart } from "./studentChart";
    import StudentChart from "./StudentChart.svelte";
    import type { Student } from "$lib/database";
    import { printComponent } from "$lib/print.svelte";

    let { ratings, myself, print = false }: { ratings: RatingWithStudents[], myself: Student, print?: boolean } = $props()
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
            })), print,
        ));

        return () => {
            chart?.destroy()
        }
    })

    const printTitle = `${myself.names} ${myself.surname} — hodnocení sympatií ${bySameStudent ? 'ostatních' : 'ostatními'}`
</script>

{#if print}
    <title>{printTitle}</title>
    <h3>{printTitle}</h3>
{/if}

<div class="chart-root" class:print>
    {#if !print}
        <div class="title">
            <h4>{bySameStudent ? 'Hodnocení ostatních:' : 'Hodnocení ostatními:'}</h4>
            <button class="neutral"
                    onclick={() => printComponent(StudentChart, { myself, ratings, print: true })}
            >Vytiskonout
            </button>
        </div>
    {/if}
    <div class="chart-container">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>

<style>
    .chart-root {
        .title {
            display: flex;
            align-items: center;
            h4 {
                margin-right: 1rem;
            }
        }

        .chart-container {
            position: relative;
            aspect-ratio: 1 / 1;
        }

        &:not(.print) {
            width: 100%;

            .chart-container {
                margin: .375rem;
                width: 100%;
                min-width: 300px;
                min-height: 300px;
                max-width: 500px;
                max-height: 500px;
            }
        }

        &.print {
            width: 210mm;
        }
    }
</style>