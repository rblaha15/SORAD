<script module lang="ts">
    import type { Class } from "$lib/database";
    import seedrandom from "seedrandom";
    import { shuffled } from "$lib/utils/random";
    import { chunked } from "$lib/utils/splitting";

    export type QuestionnaireData = {
        myself: Student
        myClass: Class
        students: Student[]
        alreadyRated: boolean
    }

    export const getRatingGroups = (myself: Student, students: Student[], maxGroupSize: number): Student[][] => {
        const classmates = students.toSpliced(students.findIndex(s => s.id == myself.id), 1);

        const random = seedrandom(`${myself.id}`)
        const shuffledStudents = shuffled(classmates, random)
        const orderedStudents = sortedBy(shuffledStudents, s => s.is_girl != myself.is_girl)

        const studentCount = students.length;
        const chunkCount = Math.ceil(studentCount / maxGroupSize);
        const chunkSize = Math.ceil(studentCount / chunkCount);
        return chunked(orderedStudents, chunkSize)
    }

    export const defaultRating = (by: number, about: number): Rating => ({
        by, about,
        influence: -1, sympathy: -1, reasoning: ''
    })

    export const validateRating = (r: Rating, phase: Phase) =>
        r.influence != -1 && (r.sympathy != -1 || phase == 'influence')
</script>

<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/state";
    import { pushState } from "$app/navigation";
    import Tutorial from "./Tutorial.svelte";
    import { storeable, value } from "$lib/stores";
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import database from "$lib/database/supabase";
    import type { Rating, Student } from "$lib/database";
    import StudentRow from "$lib/components/questionnaire/StudentRow.svelte";

    import { sortedBy, sortedByDescending } from "$lib/utils/comparisons";

    let data: QuestionnaireData = $props()

    const pageState = $derived(browser ? page.state : {})
    const currentStudentId = $derived(pageState.student ?? -1)
    const phase = $derived(pageState.phase ?? 'influence')

    const myId = data.myself.id;

    const savedData = storeable<Rating[]>(`${myId}-ratings`, data.students.map(student => defaultRating(myId, student.id)))

    const allGroups = $derived(getRatingGroups(data.myself, data.students, phase == 'sympathy-reasoning' ? Number.POSITIVE_INFINITY : 7));
    const currentGroupIndex = $derived(allGroups.findIndex(g => g.some(s => s.id == currentStudentId)))
    const currentGroup = $derived(allGroups[currentGroupIndex] ?? [])

    const thisRating = (student: Student) => (r: Rating) => r.about == student.id;

    const groupRatings = $derived(sortedBy(
        sortedByDescending(
            currentGroup.map(student => ({
                student,
                rating: value({
                    get: () => $savedData[$savedData.findIndex(thisRating(student))!],
                    set: newRating =>
                        $savedData = $savedData.toSpliced($savedData.findIndex(thisRating(student)), 1, newRating),
                }),
            })), s => phase == 'sympathy-reasoning' ? Math.abs(3 - s.rating.current.sympathy) : 0
        ), s => phase == 'sympathy-reasoning' ? s.student.is_girl : false
    ))

    let showErrors = $state(false)
    const noError = $derived(groupRatings.every(({ rating }) => validateRating(rating.current, phase)))
    $effect(() => {
        if (noError) showErrors = false
    })

    const prevPhase = (phase: Phase) => phase == 'sympathy-reasoning' ? 'sympathy' : 'influence'
    const nextPhase = (phase: Phase) => phase == 'influence' ? 'sympathy' : 'sympathy-reasoning'

    const back = () => pushState('', currentGroupIndex > -1
        ? { student: allGroups[currentGroupIndex - 1]?.[0]?.id ?? -1, phase }
        : { student: allGroups[allGroups.length - 1][0].id, phase: prevPhase(phase) })
    const next = () => noError
        ? pushState('', currentGroupIndex < allGroups.length - 1
            ? { student: allGroups[currentGroupIndex + 1][0].id, phase }
            : { student: -1, phase: nextPhase(phase) })
        : showErrors = true
    const send = () => database.rate($savedData)

    const tve = data.myClass.grade > 4 ? 'Vaše' : 'Tvé'
    const i = data.myClass.grade > 4 ? 'te' : 'i'
    const te = data.myClass.grade > 4 ? 'te' : 'š'

    let sending = $state(false);
    let sendDialog = $state() as HTMLDialogElement;
</script>

<BasicLayout>
    {#snippet title()}
        {data.myself.names} {data.myself.surname} ({data.myClass.name})
    {/snippet}
    {#snippet content()}
        {#if data.alreadyRated}
            <p>Hotovo! {tve} odpovědi byly odeslány.</p>
        {:else if !data.myClass.enabled}
            <p>V této třídě aktuálně neprobíhá sběr dat.</p>
        {:else if currentGroupIndex === -1}
            <Tutorial isGirl={data.myself.is_girl} grade={data.myClass.grade} {phase} />
        {:else}
            <Tutorial isGirl={data.myself.is_girl} grade={data.myClass.grade} {phase} justOverview />
            <div class="student-group {phase.replace('-', ' ')}">
                <span class="main-title"></span>
                <span class="main-title I">Vliv:</span>
                <span class="main-title S">Sympatie:</span>
                <span class="main-title R">Vysvětlení sympatií:</span>
                {#each groupRatings as {student, rating}}
                    <StudentRow type={phase} {student} bind:rating={rating.current} {showErrors} />
                {/each}
            </div>
        {/if}
    {/snippet}
    {#snippet buttons()}
        <button class="secondary" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit</button>
        {#if data.alreadyRated || !data.myClass.enabled}{:else if currentGroupIndex === -1 && phase === 'influence'}
            <button class="primary" onclick={next}>Začít!</button>
        {:else}
            <button class="secondary" onclick={back}>Zpět</button>
            {#if phase === 'sympathy-reasoning' && currentGroupIndex === allGroups.length - 1}
                <button class="warning" onclick={() => sendDialog.showModal()}>Odeslat</button>
            {:else}
                <button class="primary" onclick={next}>Další</button>
            {/if}
        {/if}
    {/snippet}
</BasicLayout>

<dialog bind:this={sendDialog} closedby={sending ? 'none' : 'any'} onclose={() => sending && sendDialog.showModal()}>
    <h2>Odeslat dotazník</h2>
    <p>Pokud dotazník odešle{te}, nebude{te} se moci vrátit a upravit své odpovědi!</p>
    <div class="row">
        <button disabled={sending} class="primary" onclick={() => sendDialog.close()} style="margin-right: auto;">Zrušit</button>
        {#if sending}
            <div class="loader"></div>
        {/if}
        <button disabled={sending} class="danger" onclick={send}>Odeslat</button>
    </div>
</dialog>

<style>
    .student-group {
        display: grid;
        grid-template-columns: 1fr;

        .main-title {
            display: none;
        }

        @media only screen and (min-width: 250px) {
            grid-template-columns: auto 1fr;
        }
        @media only screen and (min-width: 600px) {
            grid-template-columns: auto auto 1fr;

            .main-title {
                display: inline;
                margin-left: .5rem;

                &.I {
                    color: var(--influence-color);
                }

                &.S, &.R {
                    color: var(--sympathy-color);
                }
            }

            &:not(.influence) .main-title.I,
            &:not(.sympathy) .main-title.S,
            &:not(.reasoning) .main-title.R {
                display: none;
            }
        }
    }
</style>