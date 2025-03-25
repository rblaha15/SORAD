<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class, Rating, Student} from "$lib/database";
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";
    import {Chart} from "chart.js/auto";
    import {browser} from "$app/environment";
    import {page} from "$app/state";

    const classId = browser ? Number(page.url.searchParams.get('id')) : null

    let canvas = $state() as HTMLCanvasElement;
    let klass = $state() as Class;
    type T = Exclude<Rating, 'by' | 'about'> & {
        by: Student, about: Student,
    };
    type U = Student & Pick<Rating, 'liking' | 'popularity'>;
    let ratings = $state<T[]>([]);
    let scores = $state<U[]>([]);

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
                liking: studentRatings.reduce((s, r) => s + r.liking, 0) / studentRatings.length,
                popularity: studentRatings.reduce((s, r) => s + r.popularity, 0) / studentRatings.length,
            });
        })
        new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: [{
                    data: scores.map(r => ({x: r.liking - 2, y: r.popularity - 2})),
                    backgroundColor: 'white',
                }],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Popularita',
                        },
                        type: 'linear',
                        suggestedMin: -2,
                        suggestedMax: 2,
                        grid: {
                            drawTicks: false,
                            display: false,
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Vliv',
                        },
                        type: 'linear',
                        suggestedMin: -2,
                        suggestedMax: 2,
                        grid: {
                            drawTicks: false,
                            display: false,
                            drawOnChartArea: true,
                            color: 'green',
                        },
                        ticks: {
                            major: {
                                enabled: true,
                            },
                        },
                    },
                },
            },
        });
    }
    onMount(refresh)
</script>
{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout>
        {#snippet title()}
            Třída: {klass.name}
        {/snippet}
        {#snippet content()}
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