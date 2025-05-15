<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type { Class, Student } from "$lib/database";
    import database from "$lib/database/supabase";
    import { getStudentScore, type RatingWithStudents, type StudentScore } from "$lib/admin";
    import StudentsTable from "$lib/components/admin/class/StudentsTable.svelte";
    import RatingsTable from "$lib/components/admin/class/student/RatingsTable.svelte";
    import Details from "$lib/components/Details.svelte";
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
        ratingsWrote = []
        ratingsGot = []
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
    $effect(() => {
        studentId;
        refresh();
    })
</script>

{#snippet title()}
    Administrace: třída {klass.name} <br />
    <span style="font-size: 1rem">{score.names} {score.surname}</span>
{/snippet}
{#snippet content()}
    <Details label="Grafy sympatií">
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
    </Details>
    <Details label="Přehled třídních indexů">
        <StudentsTable students={[student]} allStudents={students} {ratings} />
    </Details>
    {#if ratingsGot.length || ratingsWrote.length}
        <Details label="Seznam hodnocení">
            <RatingsTable {ratingsGot} {ratingsWrote} {students} />
        </Details>
    {/if}
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={() => goto(`/admin?class=${classId}`, { replaceState: false })}>Zpět</button>
    <button class="secondary" onclick={database.auth.logOut} >Odhlásit se</button>
{/snippet}

<title>{score ? `${score.names} ${score.surname}` : 'Žák'}</title>

{#if klass === undefined || score === undefined}
    <div><span class="loader"></span></div>
{:else}
    <BasicLayout {buttons} {content} {title} />
{/if}

<style>
    .charts {
        display: flex;
        flex-wrap: wrap;
    }
</style>