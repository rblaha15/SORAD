<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class} from "$lib/database";
    import database from "$lib/database/supabase";
    import {onMount} from "svelte";
    import {averageBy, type RatingWithStudents, type StudentScore} from "$lib/data";
    import {error} from "@sveltejs/kit";

    let {studentId, classId}: { studentId: number, classId: number } = $props()

    let klass = $state() as Class;
    let ratingsWrote = $state<RatingWithStudents[]>([]);
    let ratingsGot = $state<RatingWithStudents[]>([]);
    let score = $state() as StudentScore;

    const refresh = async () => {
        klass = await database.getMyClass(classId)
        const r = await database.admin.getClassRatings(classId)
        const students = await database.getStudentsOfClass(classId)
        const student = students.find(s => s.id == studentId)!

        ratingsWrote = r.filter(r => r.by == studentId).map(r => ({
            ...r, by: student, about: students.find(s => s.id == r.about)!
        }))
        ratingsGot = r.filter(r => r.about == studentId).map(r => ({
            ...r, by: students.find(s => s.id == r.by)!, about: student,
        }))
        score = {
            ...student,
            liking: Number(averageBy(ratingsGot, r => r.liking).toFixed(2)),
            popularity: Number(averageBy(ratingsGot, r => r.popularity).toFixed(2)),
        }
    }
    onMount(refresh)
</script>

{#snippet title()}
    Třída: {klass.name} <br/>
    <span style="font-size: 1rem">{score.names} {score.surname}</span>
{/snippet}
{#snippet content()}{/snippet}
{#snippet buttons()}{/snippet}

{#if klass === undefined || score === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title}/>
{/if}