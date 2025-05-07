<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type { Class, Student } from "$lib/database";
    import database from "$lib/database/supabase";
    import { onMount } from "svelte";
    import { getStudentScore, type RatingWithStudents, type StudentScore } from "$lib/admin";
    import StudentsTable from "$lib/components/admin/class/StudentsTable.svelte";
    import RatingsTable from "$lib/components/admin/class/student/RatingsTable.svelte";
    import Collapsible from "$lib/components/Collapsible.svelte";
    import StudentChart from "$lib/components/admin/class/student/StudentChart.svelte";
    import TopScrollable from "$lib/components/TopScrollable.svelte";
    import { goto } from "$app/navigation";

    let { studentId, classId }: { studentId: number, classId: number } = $props()

    let klass = $state() as Class;
    let ratingsWrote = $state<RatingWithStudents[]>([]);
    let ratingsGot = $state<RatingWithStudents[]>([]);
    let ratings = $state<RatingWithStudents[]>([]);
    let students = $state<Student[]>([]);
    let student = $state() as Student;
    let classScores = $state() as StudentScore[];
    let score = $state() as StudentScore;

    const refresh = async () => {
        klass = await database.getMyClass(classId)
        const r = await database.admin.getClassRatings(classId)
        students = await database.getStudentsOfClass(classId)
        student = students.find(s => s.id == studentId)!

        ratings = r.map(r => ({
            ...r, by: students.find(s => s.id == r.by)!, about: students.find(s => s.id == r.about)!
        }))
        ratingsWrote = ratings.filter(r => r.by.id == studentId)
        ratingsGot = ratings.filter(r => r.about.id == studentId)
        classScores = students.map(s =>
            getStudentScore(s, r.filter(r => r.about == s.id), r.filter(r => r.by == s.id))
        )
        score = classScores.find(s => s.id == studentId)!
    }
    onMount(refresh)

    const a = $derived(score?.is_girl ? 'a' : '')
</script>

{#snippet title()}
    Administrace: třída {klass.name} <br />
    <span style="font-size: 1rem">{score.names} {score.surname}</span>
{/snippet}
{#snippet content()}
    <Collapsible label="Grafy sympatií">
        <TopScrollable>
            <div class="charts">
                {#if ratingsGot.length}
                    <StudentChart myself={student} ratings={ratingsGot} />
                {/if}
                {#if ratingsWrote.length}
                    <StudentChart myself={student} ratings={ratingsWrote} />
                {/if}
            </div>
        </TopScrollable>
    </Collapsible>
    <Collapsible label="Přehled třídních indexů">
        <StudentsTable students={[student]} allStudents={students} {ratings} />
    </Collapsible>
    {#if ratingsGot.length}
        <Collapsible label="Hodnocení, která dostal{a}">
            <RatingsTable ratings={ratingsGot} mode="by" />
        </Collapsible>
    {/if}
    {#if ratingsWrote.length}
        <Collapsible label="Hodnocení, která dal{a}">
            <RatingsTable ratings={ratingsWrote} mode="about" />
        </Collapsible>
    {/if}
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={() => goto(`/admin?class=${classId}`, { replaceState: true })}>Zpět</button>
    <button class="secondary" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit</button>
{/snippet}

{#if klass === undefined || score === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title} />
{/if}

<style>
    .charts {
        display: flex;
        flex-wrap: wrap;
    }
</style>