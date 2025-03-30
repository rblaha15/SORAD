<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class} from "$lib/database";
    import database from "$lib/database/supabase";
    import {onMount} from "svelte";
    import {getStudentScore, type RatingWithStudents, type StudentScore} from "$lib/data";
    import StudentsTable from "$lib/components/admin/class/StudentsTable.svelte";

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
        score = getStudentScore(student, ratingsGot, ratingsWrote)
    }
    onMount(refresh)
</script>

{#snippet title()}
    Třída: {klass.name} <br/>
    <span style="font-size: 1rem">{score.names} {score.surname}</span>
{/snippet}
{#snippet content()}
    <StudentsTable {classId} scores={[score]} />
{/snippet}
{#snippet buttons()}
    <button class="grey" onclick={() => window.history.back()}>Zpět</button>
    <button class="grey" onclick={database.auth.logOut} style="margin-right: 'auto';">Odhlásit</button>
{/snippet}

{#if klass === undefined || score === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title}/>
{/if}