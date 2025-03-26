<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class, Rating, Student} from "$lib/database";
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";
    import {Chart} from "chart.js/auto";
    import "chartjs-plugin-annotation";
    import {browser} from "$app/environment";
    import {page} from "$app/state";
    import Annotation from "chartjs-plugin-annotation";

    Chart.register(Annotation);

    const classId = browser ? Number(page.url.searchParams.get('id')) : null

    let canvas = $state() as HTMLCanvasElement;
    let klass = $state() as Class;
    type T = Exclude<Rating, 'by' | 'about'> & {
        by: Student, about: Student,
    };
    type U = Student & Pick<Rating, 'liking' | 'popularity'>;
    let ratings = $state<T[]>([]);
    let scores = $state<U[]>([]);
    let chart = $state<Chart>();

    const refresh = async () => {
        klass = await database.getMyClass(classId!)
        const r = await database.admin.getClassRatings(classId!)
        const students = await database.getStudentsOfClass(classId!)
        ratings = r.map(r => ({
            ...r, by: students.find(s => s.id == r.by)!, about: students.find(s => s.id == r.about)!
        }))
        scores = students.map(s => {
            const studentRatings = r.filter(r => r.about == s.id);
            return ({
                ...s,
                liking: Number((studentRatings.reduce((s, r) => s + r.liking, 0) / studentRatings.length).toFixed(2)),
                popularity: Number((studentRatings.reduce((s, r) => s + r.popularity, 0) / studentRatings.length).toFixed(2)),
            });
        })
        chart?.destroy()
        chart = new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: scores.map(r => ({x: r.liking - 2, y: r.popularity - 2})),
                    backgroundColor: 'white',
                    pointRadius: 5
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: -2,
                        max: 2,
                        ticks: {
                            stepSize: 1,
                            color: 'white',
                        },
                        grid: {
                            drawTicks: false,
                            drawOnChartArea: true,
                            color: ctx => ctx.tick.value === 0 ? 'white' : 'transparent',
                        },
                    },
                    y: {
                        min: -2,
                        max: 2,
                        ticks: {
                            stepSize: 1,
                            color: 'white',
                        },
                        grid: {
                            drawTicks: false,
                            drawOnChartArea: true,
                            color: ctx => ctx.tick.value === 0 ? 'white' : 'transparent'
                        },
                    },
                },
                layout: {
                    padding: 40,
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const point = scores[tooltipItem.dataIndex];
                                return `(${point.liking}, ${point.popularity}) - ${point.names} ${point.surname}`;
                            },
                        },
                    },
                    legend: {
                        display: false,
                    },
                    annotation: {
                        annotations: {
                            topLabel: {
                                type: 'label',
                                xValue: 0,
                                yValue: 1.9,
                                content: 'Největší vliv',
                                color: 'white',
                                font: { size: 14 },
                                position: 'center',
                            },
                            bottomLabel: {
                                type: 'label',
                                xValue: 0,
                                yValue: -1.9,
                                content: 'Nejmenší vliv',
                                color: 'white',
                                font: { size: 14 },
                                position: 'center'
                            },
                            leftLabel: {
                                type: 'label',
                                xValue: -1.9,
                                yValue: 0,
                                content: 'Nejméně oblíbený',
                                color: 'white',
                                font: { size: 14 },
                                position: 'center',
                                rotation: -90,
                            },
                            rightLabel: {
                                type: 'label',
                                xValue: 1.9,
                                yValue: 0,
                                content: 'Nejvíce oblíbený',
                                color: 'white',
                                font: { size: 14 },
                                position: 'center',
                                rotation: 90,
                            },
                        }
                    },
                },
            },
            plugins: [Annotation]
        });
    }
    onMount(refresh)

    const d = async () => {
        const students = await database.getStudentsOfClass(classId!)
        const khv = students.flatMap(st => {
            const e = Math.random() * 2
            const f = Math.random() * 2
            return students.map(st2 => {
                const liking = Math.min(Math.max(Math.floor(Math.random() * e * 5), 0), 5);
                const popularity = Math.min(Math.max(Math.floor(Math.random() * f * 5), 0), 5);
                return {
                    by: st2.id,
                    about: st.id,
                    liking: liking,
                    popularity: popularity,
                    reasoning: '',
                }
            })
        })
        await database.rate(khv)
        await refresh()
    }
</script>
{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout>
        {#snippet title()}
            Třída: {klass.name}
        {/snippet}
        {#snippet content()}
            <button onclick={d}>D</button>
            <!--            <p>Hodnocení</p>-->
            <!--            {#each ratings as rating}-->
            <!--                <p>{rating.by.surname} -> {rating.about.surname}: {rating.popularity + 1}; {rating.liking + 1}-->
            <!--                    ({rating.reasoning})</p>-->
            <!--            {/each}-->
            <!--            <p>Lidi</p>-->
            <!--            {#each scores as score}-->
            <!--                <p>{score.surname}: {score.popularity + 1}; {score.liking + 1}</p>-->
            <!--            {/each}-->
            <canvas bind:this={canvas}></canvas>
        {/snippet}
        {#snippet buttons()}{/snippet}
    </BasicLayout>
{/if}