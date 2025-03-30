<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class, Rating, Student} from "$lib/database";
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";
    import {Chart} from "chart.js/auto";
    import "chartjs-plugin-annotation";
    import {browser} from "$app/environment";
    import {page} from "$app/state";
    import {chartConfig, type StudentScore} from "./chartConfig";

    const classId = browser ? Number(page.url.searchParams.get('id')) : null

    let canvas = $state() as HTMLCanvasElement;
    let klass = $state() as Class;
    type RatingWithStudents = Omit<Rating, 'by' | 'about'> & { by: Student, about: Student };
    let ratings = $state<RatingWithStudents[]>([]);
    let scores = $state<StudentScore[]>([]);
    let chart = $state<Chart>();

    const averageBy = <T> (array: T[], callback: (item: T, index: number, array: T[]) => number) =>
        sumBy(array, callback) / array.length;

    const sumBy = <T> (array: T[], callback: (item: T, index: number, array: T[]) => number) =>
        array.reduce((sum, item, index, array) => sum + callback(item, index, array), 0);

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
                liking: Number(averageBy(studentRatings, r => r.liking).toFixed(2)),
                popularity: Number(averageBy(studentRatings, r => r.popularity).toFixed(2)),
            });
        })
        chart?.destroy()
        chart = new Chart(canvas, chartConfig(scores));
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
            <div class="chart-holder">
                <p class="top">Nejvíce oblíbení</p>
                <p class="left">Nejméně vlivní</p>
                <canvas width="500" height="500" bind:this={canvas}></canvas>
                <p class="right">Nejvíce vlivní</p>
                <p class="bottom">Nejméně oblíbení</p>
            </div>
        {/snippet}
        {#snippet buttons()}{/snippet}
    </BasicLayout>
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
        .top { grid-area: T }
        .bottom { grid-area: B }
        .left { grid-area: L; rotate: -90deg }
        .right { grid-area: R; rotate: 90deg }
        canvas { grid-area: C }
    }
</style>